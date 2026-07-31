/* ==========================================================================
   AdoraScale - App Core Engine
   Features:
   - Firebase Realtime Firestore Synchronization (onSnapshot)
   - PWA & Web Push Notification (FCM) Support
   - 2-Week Advanced Schedule Confirmation Reminder
   - Scalable state management supporting 200+ active users
   ========================================================================== */

// ==================== CONFIGURAÇÃO DO FIREBASE ====================
const firebaseConfig = {
  apiKey: "AIzaSyC6aTAQin74yqPDl6Q54uT42RvPamuFXMM",
  authDomain: "adorascale.firebaseapp.com",
  projectId: "adorascale",
  storageBucket: "adorascale.firebasestorage.app",
  messagingSenderId: "717015706908",
  appId: "1:717015706908:web:aa2e944ee990580b791ed9"
};

// Inicialização das Instâncias do Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

let messaging = null;
if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
}

// ==================== ESTADO DA APLICAÇÃO (STATE MANAGEMENT) ====================
let appState = {
    songs: [],
    members: [],
    schedules: [],
    users: [],
    currentUser: null,
    currentRole: "usuario" // "admin" ou "usuario"
};

let isInitialLoad = true;

// ==================== INICIALIZAÇÃO DA APLICAÇÃO ====================
document.addEventListener("DOMContentLoaded", async () => {
    setupEventListeners();
    updateLiveDate();
    registerServiceWorker();
    setupRealtimeListeners(); // Conectividade em tempo real com Firestore
    initRole();
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
    switchTab("dashboard");
    requestNotificationPermission();
});

// ==================== PWA & NOTIFICAÇÕES (FCM) ====================
function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js")
            .then((registration) => {
                console.log("[PWA] Service Worker registrado com sucesso:", registration.scope);
            })
            .catch((error) => {
                console.error("[PWA] Falha ao registrar Service Worker:", error);
            });
    }
}

async function requestNotificationPermission() {
    if (!messaging) return;
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await messaging.getToken();
            if (token && appState.currentUser) {
                // Registra/atualiza o Token Push do usuário logado no Firestore
                await db.collection("users").doc(appState.currentUser.id).update({ 
                    fcmToken: token,
                    lastActive: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        }
    } catch (err) {
        console.warn("[FCM] Permissão de notificação negada ou não configurada:", err);
    }
}

// ==================== SINCRONIZAÇÃO EM TEMPO REAL (REALTIME LISTENERS) ====================
function setupRealtimeListeners() {
    // Sincronização em tempo real de Músicas
    db.collection("songs").onSnapshot((snapshot) => {
        appState.songs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderSongs();
        renderDashboard();
    }, (error) => console.error("Erro no listener de músicas:", error));

    // Sincronização em tempo real de Membros
    db.collection("members").onSnapshot((snapshot) => {
        appState.members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderMembers();
        renderDashboard();
    }, (error) => console.error("Erro no listener de membros:", error));

    // Sincronização em tempo real de Usuários
    db.collection("users").onSnapshot((snapshot) => {
        appState.users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderSettings();
    }, (error) => console.error("Erro no listener de usuários:", error));

    // Sincronização em tempo real de Escalas
    db.collection("schedules").onSnapshot((snapshot) => {
        const previousCount = appState.schedules.length;
        appState.schedules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        sortAppStateData();
        renderSchedules();
        renderDashboard();

        // Notificação visual em tempo real quando uma nova escala for adicionada
        if (!isInitialLoad && snapshot.docs.length > previousCount) {
            showToast("Uma nova escala de culto foi inserida!", "info");
            if (Notification.permission === "granted") {
                new Notification("Nova Escala Publicada!", {
                    body: "Uma nova escala de culto foi adicionada ao AdoraScale.",
                    icon: "./icon-192.jpg"
                });
            }
        }
        
        isInitialLoad = false;
        checkUpcomingSchedulesReminder(); // Executa checagem de lembretes
    }, (error) => console.error("Erro no listener de escalas:", error));
}

// Ordenação dos dados
function sortAppStateData() {
    appState.schedules.sort((a, b) => new Date(`${a.data}T${a.hora || '00:00'}`) - new Date(`${b.data}T${b.hora || '00:00'}`));
    appState.songs.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''));
    appState.members.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
}

// ==================== OPERAÇÕES NO FIRESTORE (PERSISTÊNCIA) ====================
async function saveDocument(collectionName, data) {
    try {
        const docId = data.id || db.collection(collectionName).doc().id;
        const itemToSave = { ...data, id: docId, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
        await db.collection(collectionName).doc(docId).set(itemToSave, { merge: true });
        showToast("Dados salvos com sucesso!", "success");
    } catch (error) {
        console.error(`Erro ao salvar documento em [${collectionName}]:`, error);
        showToast("Erro ao salvar no servidor.", "danger");
    }
}

async function deleteDocument(collectionName, id) {
    try {
        await db.collection(collectionName).doc(id).delete();
        showToast("Item removido com sucesso!", "warning");
    } catch (error) {
        console.error(`Erro ao remover documento [${id}] de [${collectionName}]:`, error);
        showToast("Erro ao excluir do servidor.", "danger");
    }
}

// ==================== SISTEMA DE LEMBRETE (2 SEMANAS DE ANTECEDÊNCIA) ====================
function checkUpcomingSchedulesReminder() {
    if (!appState.currentUser || !appState.currentUser.memberId) return;

    const userMemberId = appState.currentUser.memberId;
    const now = new Date();

    appState.schedules.forEach((sc) => {
        if (!sc.data) return;
        const scheduleDate = new Date(`${sc.data}T${sc.hora || '00:00'}`);
        const diffInDays = Math.ceil((scheduleDate - now) / (1000 * 60 * 60 * 24));

        // Filtra cultos que ocorrerão entre 13 e 15 dias no futuro (aproximadamente 2 semanas)
        if (diffInDays >= 13 && diffInDays <= 15) {
            const positions = ['ministro', 'teclado', 'violao', 'guitarra', 'baixo', 'bateria', 'percussao', 'vocal1', 'vocal2', 'vocal3', 'som', 'midia', 'transmissao'];
            const isUserScheduled = positions.some(pos => sc[pos] === userMemberId);

            if (isUserScheduled) {
                const status = (sc.confirmacoes && sc.confirmacoes[userMemberId]) || "pendente";
                if (status === "pendente") {
                    const formattedDate = scheduleDate.toLocaleDateString("pt-BR");
                    showToast(`Aviso: Você está escalado no culto de ${formattedDate}. Por favor, confirme sua presença!`, "warning");

                    if (Notification.permission === "granted") {
                        new Notification("Lembrete de Escala (2 Semanas)", {
                            body: `Você possui uma escala no dia ${formattedDate} aguardando sua confirmação.`,
                            icon: "./icon-192.jpg"
                        });
                    }
                }
            }
        }
    });
}

// Confirmar Presença na Escala
async function confirmAttendance(scheduleId, status) {
    if (!appState.currentUser || !appState.currentUser.memberId) {
        showToast("Sua conta de usuário não está vinculada a um perfil de membro.", "danger");
        return;
    }
    const memberId = appState.currentUser.memberId;
    try {
        await db.collection("schedules").doc(scheduleId).set({
            confirmacoes: {
                [memberId]: status
            }
        }, { merge: true });
        showToast(`Presença atualizada para: ${status.toUpperCase()}`, "success");
    } catch (error) {
        console.error("Erro ao confirmar presença:", error);
        showToast("Falha ao salvar confirmação.", "danger");
    }
}

// ==================== GERENCIAMENTO DE NAVEGAÇÃO E TABS ====================
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const navButtons = document.querySelectorAll('.nav-btn');

    tabs.forEach(tab => {
        tab.style.display = tab.id === `tab-${tabName}` ? 'block' : 'none';
    });

    navButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

// ==================== MÓDULOS DE RENDERIZAÇÃO (UI) ====================
function renderDashboard() {
    const nextScheduleContainer = document.getElementById("next-schedule-card");
    if (!nextScheduleContainer) return;

    const now = new Date();
    const upcoming = appState.schedules.filter(s => new Date(`${s.data}T${s.hora || '00:00'}`) >= now);

    if (upcoming.length === 0) {
        nextScheduleContainer.innerHTML = `<div class="empty-state">Nenhuma próxima escala agendada.</div>`;
        return;
    }

    const next = upcoming[0];
    const formattedDate = new Date(`${next.data}T${next.hora || '00:00'}`).toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    nextScheduleContainer.innerHTML = `
        <div class="card-schedule-highlight">
            <div class="badge-title">Próximo Culto</div>
            <h3>${next.titulo || 'Culto de Louvor'}</h3>
            <p class="date-text"><i data-lucide="calendar"></i> ${formattedDate} às ${next.hora || '00:00'}</p>
            <div class="actions-group">
                <button onclick="confirmAttendance('${next.id}', 'confirmado')" class="btn-confirm">Confirmar Presença</button>
                <button onclick="confirmAttendance('${next.id}', 'recusado')" class="btn-decline">Não poderei ir</button>
            </div>
        </div>
    `;

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

function renderSchedules() {
    const container = document.getElementById("schedules-list");
    if (!container) return;

    if (appState.schedules.length === 0) {
        container.innerHTML = `<p class="empty-text">Nenhuma escala cadastrada.</p>`;
        return;
    }

    container.innerHTML = appState.schedules.map(sc => `
        <div class="schedule-card">
            <div class="schedule-header">
                <h4>${sc.titulo || 'Culto'}</h4>
                <span>${sc.data} às ${sc.hora || '00:00'}</span>
            </div>
            <p><strong>Ministro:</strong> ${getMemberName(sc.ministro)}</p>
            <p><strong>Músicos:</strong> ${getMemberName(sc.teclado)}, ${getMemberName(sc.violao)}, ${getMemberName(sc.bateria)}</p>
            ${appState.currentRole === 'admin' ? `<button onclick="deleteDocument('schedules', '${sc.id}')" class="btn-delete">Excluir Escala</button>` : ''}
        </div>
    `).join('');
}

function renderSongs() {
    const container = document.getElementById("songs-list");
    if (!container) return;

    if (appState.songs.length === 0) {
        container.innerHTML = `<p class="empty-text">Nenhuma música cadastrada no repertório.</p>`;
        return;
    }

    container.innerHTML = appState.songs.map(song => `
        <div class="song-card">
            <h4>${song.titulo}</h4>
            <p><strong>Artista:</strong> ${song.artista || 'N/A'} | <strong>Tom:</strong> ${song.tom || 'N/A'}</p>
            ${song.link ? `<a href="${song.link}" target="_blank" class="song-link">Ver Cifra / Link</a>` : ''}
            ${appState.currentRole === 'admin' ? `<button onclick="deleteDocument('songs', '${song.id}')" class="btn-delete-sm">Excluir</button>` : ''}
        </div>
    `).join('');
}

function renderMembers() {
    const container = document.getElementById("members-list");
    if (!container) return;

    if (appState.members.length === 0) {
        container.innerHTML = `<p class="empty-text">Nenhum membro cadastrado.</p>`;
        return;
    }

    container.innerHTML = appState.members.map(m => `
        <div class="member-card">
            <h4>${m.nome}</h4>
            <p><strong>Função:</strong> ${m.instrumento || 'Integrante'}</p>
            <p><strong>Telefone:</strong> ${m.telefone || 'Não informado'}</p>
            ${appState.currentRole === 'admin' ? `<button onclick="deleteDocument('members', '${m.id}')" class="btn-delete-sm">Remover</button>` : ''}
        </div>
    `).join('');
}

function renderSettings() {
    const container = document.getElementById("users-list");
    if (!container) return;

    container.innerHTML = appState.users.map(u => `
        <div class="user-row">
            <span>${u.nome || u.email} (${u.role || 'usuario'})</span>
        </div>
    `).join('');
}

// Auxiliares de Interface
function getMemberName(id) {
    if (!id) return 'Não escalado';
    const member = appState.members.find(m => m.id === id);
    return member ? member.nome : 'Desconhecido';
}

function updateLiveDate() {
    const el = document.getElementById("live-date");
    if (el) {
        const now = new Date();
        el.textContent = now.toLocaleDateString("pt-BR", { weekday: 'long', day: 'numeric', month: 'long' });
    }
}

function initRole() {
    const savedRole = localStorage.getItem("adora_role") || "usuario";
    appState.currentRole = savedRole;
    document.body.setAttribute("data-role", savedRole);
}

function setupEventListeners() {
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const tab = e.currentTarget.dataset.tab;
            if (tab) switchTab(tab);
        });
    });
}

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container") || createToastContainer();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function createToastContainer() {
    const container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
    return container;
}