// ==================== STATE MANAGEMENT ====================
let state = {
    songs: [],
    members: [],
    schedules: [],
    users: [],
    currentUser: null,
    currentRole: "usuario"
};

function buildDefaultUsers() {
    const users = [{
        id: "u_admin",
        username: "admin",
        password: "adoracao123",
        nome: "Administrador",
        role: "administrador",
        telefone: "11999990000",
        memberId: ""
    }];

    const memberIds = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"];
    for (let i = 1; i <= 99; i++) {
        const memberId = memberIds[(i - 1) % memberIds.length] || "";
        users.push({
            id: `u${i}`,
            username: `user${i}`,
            password: "senha123",
            nome: `Usuário ${i}`,
            role: "usuario",
            telefone: `119${String(i).padStart(8, "0")}`,
            memberId
        });
    }

    return users;
}

// Default Mock Data in Portuguese
const defaultMockData = {
    songs: [
        {
            id: "s1",
            titulo: "A Casa é Sua",
            artista: "Casa Worship",
            tom: "G",
            bpm: 74,
            linkDrive: "https://drive.google.com/file/d/1_Cifra_A_Casa_E_Sua",
            linkVideo: "https://www.youtube.com/watch?v=21LPl9622d0",
            observacoes: "Começo suave só teclado e ministro. A bateria entra forte na segunda parte do refrão."
        },
        {
            id: "s2",
            titulo: "Yeshua",
            artista: "Alessandro Vilas Boas",
            tom: "A",
            bpm: 68,
            linkDrive: "https://drive.google.com/file/d/1_Cifra_Yeshua",
            linkVideo: "https://www.youtube.com/watch?v=n577yV379e4",
            observacoes: "Espontâneo longo após o refrão. Ficar atento às indicações do ministro."
        },
        {
            id: "s3",
            titulo: "O Escudo",
            artista: "Grupo Elo / Voz da Verdade",
            tom: "F",
            bpm: 80,
            linkDrive: "https://drive.google.com/file/d/1_Cifra_O_Escudo",
            linkVideo: "https://www.youtube.com/watch?v=F_fV17u6211",
            observacoes: "Introdução marcante do teclado e violão. Vocal entra em uníssono."
        },
        {
            id: "s4",
            titulo: "Lindo És",
            artista: "David Brymer",
            tom: "Em",
            bpm: 72,
            linkDrive: "https://drive.google.com/file/d/1_Cifra_Lindo_Es",
            linkVideo: "https://www.youtube.com/watch?v=Cq_tGki3k8E",
            observacoes: "Fazer a transição suave para 'Só Quero Ver Você'."
        },
        {
            id: "s5",
            titulo: "Vim Para Adorar-te",
            artista: "Adoração e Adoradores",
            tom: "E",
            bpm: 76,
            linkDrive: "https://drive.google.com/file/d/1_Cifra_Vim_Para_Adorar_Te",
            linkVideo: "https://www.youtube.com/watch?v=mC145p2o58o",
            observacoes: "Tom original é E. O vocal feminino lidera."
        },
        {
            id: "s6",
            titulo: "A Ele a Glória",
            artista: "Diante do Trono",
            tom: "C",
            bpm: 65,
            linkDrive: "https://drive.google.com/file/d/1_Cifra_A_Ele_A_Gloria",
            linkVideo: "https://www.youtube.com/watch?v=xTf43t61111",
            observacoes: "Clímax de adoração. Todos os instrumentos sobem o tom na última estrofe."
        }
    ],
    members: [
        { id: "m1", nome: "Gabriel Silva", telefone: "11999991111", funcoes: ["Teclado", "Vocal"] },
        { id: "m2", nome: "Lucas Rodrigues", telefone: "11999992222", funcoes: ["Violão", "Guitarra"] },
        { id: "m3", nome: "Ana Costa", telefone: "11999993333", funcoes: ["Ministro(a)", "Vocal"] },
        { id: "m4", nome: "Mateus Santos", telefone: "11999994444", funcoes: ["Baixo"] },
        { id: "m5", nome: "Thiago Oliveira", telefone: "11999995555", funcoes: ["Bateria"] },
        { id: "m6", nome: "Rebeca Lima", telefone: "11999996666", funcoes: ["Ministro(a)", "Vocal"] },
        { id: "m7", nome: "Felipe Almeida", telefone: "11999997777", funcoes: ["Som"] },
        { id: "m8", nome: "Karina Souza", telefone: "11999998888", funcoes: ["Mídia"] }
    ],
    schedules: [
        {
            id: "sc1",
            data: "2026-07-19",
            hora: "19:00",
            tipo: "Culto de Domingo",
            obs: "Culto de Celebração e Santa Ceia",
            ministro: "m3",
            teclado: "m1",
            violao: "m2",
            guitarra: "",
            baixo: "m4",
            bateria: "m5",
            vocal1: "m6",
            vocal2: "",
            vocal3: "",
            som: "m7",
            midia: "m8",
            setlist: ["s1", "s2", "s6"],
            confirmacoes: {
                "m3": "confirmado",
                "m1": "confirmado",
                "m2": "pendente",
                "m4": "pendente",
                "m5": "confirmado",
                "m6": "confirmado",
                "m7": "pendente",
                "m8": "confirmado"
            }
        },
        {
            id: "sc2",
            data: "2026-07-22",
            hora: "19:30",
            tipo: "Culto de Ensino",
            obs: "Estudo Bíblico nas Quartas",
            ministro: "m6",
            teclado: "m1",
            violao: "m2",
            guitarra: "",
            baixo: "m4",
            bateria: "",
            vocal1: "",
            vocal2: "",
            vocal3: "",
            som: "m7",
            midia: "",
            setlist: ["s3", "s5"],
            confirmacoes: {
                "m6": "pendente",
                "m1": "pendente",
                "m2": "indisponivel",
                "m4": "pendente",
                "m7": "confirmado"
            }
        }
    ]
};

// Temporary scale creation state for setlist
let currentScaleSetlist = [];

// ==================== APP INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    setupEventListeners();
    updateLiveDate();
    initRole();
    initLucide();
    switchTab("dashboard");
});

function initLucide() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ==================== ROLE-BASED ACCESS CONTROL ====================
function initRole() {
    const savedCurrentUser = sessionStorage.getItem("adorascale_currentUser");
    if (savedCurrentUser) {
        const parsedUser = JSON.parse(savedCurrentUser);
        const matchedUser = state.users.find(user => user.id === parsedUser.id);
        if (matchedUser) {
            state.currentUser = matchedUser;
            state.currentRole = matchedUser.role;
        }
    } else {
        state.currentUser = null;
        state.currentRole = "usuario";
    }
    updateRoleUI();
}

function updateRoleUI() {
    const body = document.body;
    const roleIcon = document.getElementById("sidebar-role-icon");
    const roleName = document.getElementById("sidebar-role-name");
    const roleBadge = document.getElementById("sidebar-role-badge");
    const btnText = document.getElementById("btn-login-text");
    const btnIcon = document.querySelector("#btn-login-modal i");

    if (state.currentRole === "administrador") {
        body.classList.remove("user-mode");
        body.classList.add("admin-mode");

        if (roleIcon) {
            roleIcon.style.backgroundColor = "rgba(99, 102, 241, 0.15)";
            roleIcon.innerHTML = '<i data-lucide="unlock" style="width:16px; height:16px;"></i>';
        }
        if (roleName) roleName.textContent = state.currentUser ? `Olá, ${state.currentUser.nome.split(" ")[0]}` : "Painel Admin";
        if (roleBadge) {
            roleBadge.textContent = "Admin";
            roleBadge.className = "role-badge";
        }
        if (btnText) btnText.textContent = "Sair (Leitor)";
        if (btnIcon) {
            btnIcon.className = "";
            btnIcon.setAttribute("data-lucide", "log-out");
        }
    } else {
        body.classList.remove("admin-mode");
        body.classList.add("user-mode");

        if (roleIcon) {
            roleIcon.style.backgroundColor = "var(--secondary)";
            roleIcon.innerHTML = '<i data-lucide="lock" style="width:16px; height:16px;"></i>';
        }
        if (roleName) roleName.textContent = state.currentUser ? `Olá, ${state.currentUser.nome.split(" ")[0]}` : "Modo Leitor";
        if (roleBadge) {
            roleBadge.textContent = state.currentUser ? (state.currentUser.role === "administrador" ? "Admin" : "Usuário") : "Usuário";
            roleBadge.className = "role-badge";
        }
        if (btnText) btnText.textContent = "Área Restrita";
        if (btnIcon) {
            btnIcon.className = "";
            btnIcon.setAttribute("data-lucide", "log-in");
        }

        // If on admin only configurations tab, return to dashboard
        const activeNav = document.querySelector(".nav-item.active");
        if (activeNav && activeNav.getAttribute("data-tab") === "configuracoes") {
            switchTab("dashboard");
        }
    }

    initLucide();
}

function getCurrentUserMemberId() {
    return state.currentUser && state.currentUser.memberId ? state.currentUser.memberId : null;
}

function toggleLoginState() {
    if (state.currentUser) {
        state.currentUser = null;
        state.currentRole = "usuario";
        sessionStorage.removeItem("adorascale_currentUser");
        sessionStorage.removeItem("adorascale_role");
        updateRoleUI();
        showToast("Você saiu da sessão atual.", "info");
    } else {
        const modal = document.getElementById("modal-login");
        const passwordInput = document.getElementById("login-senha");
        const usernameInput = document.getElementById("login-username");
        if (passwordInput) passwordInput.value = "";
        if (usernameInput) usernameInput.value = "";
        if (modal) modal.classList.add("active");
    }
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const usernameInput = document.getElementById("login-username");
    const passwordInput = document.getElementById("login-senha");
    const username = usernameInput ? usernameInput.value.trim().toLowerCase() : "";
    const password = passwordInput ? passwordInput.value : "";

    const user = state.users.find(item => item.username.toLowerCase() === username && item.password === password);

    if (user) {
        state.currentUser = user;
        state.currentRole = user.role;
        saveState();
        updateRoleUI();
        showToast(`Bem-vindo(a), ${user.nome}!`, "success");
        const modal = document.getElementById("modal-login");
        if (modal) modal.classList.remove("active");
    } else {
        showToast("Login ou senha incorretos!", "danger");
    }
}

// Load state from LocalStorage or initialize with defaults
function loadState() {
    const songs = localStorage.getItem("adorascale_songs");
    const members = localStorage.getItem("adorascale_members");
    const schedules = localStorage.getItem("adorascale_schedules");
    const users = localStorage.getItem("adorascale_users");

    if (songs && members && schedules) {
        state.songs = JSON.parse(songs);
        state.members = JSON.parse(members);
        state.schedules = JSON.parse(schedules);
        state.users = users ? JSON.parse(users) : buildDefaultUsers();
    } else {
        // Load default mock data
        state.songs = [...defaultMockData.songs];
        state.members = [...defaultMockData.members];
        state.schedules = [...defaultMockData.schedules];
        state.users = buildDefaultUsers();
        saveState();
    }

    const savedCurrentUser = sessionStorage.getItem("adorascale_currentUser");
    if (savedCurrentUser) {
        const parsedUser = JSON.parse(savedCurrentUser);
        const matchedUser = state.users.find(user => user.id === parsedUser.id);
        if (matchedUser) {
            state.currentUser = matchedUser;
            state.currentRole = matchedUser.role;
        }
    } else {
        state.currentUser = null;
        state.currentRole = "usuario";
    }
    
    // Sort items logically
    sortStateData();
}

function saveState() {
    localStorage.setItem("adorascale_songs", JSON.stringify(state.songs));
    localStorage.setItem("adorascale_members", JSON.stringify(state.members));
    localStorage.setItem("adorascale_schedules", JSON.stringify(state.schedules));
    localStorage.setItem("adorascale_users", JSON.stringify(state.users));

    if (state.currentUser) {
        sessionStorage.setItem("adorascale_currentUser", JSON.stringify(state.currentUser));
    } else {
        sessionStorage.removeItem("adorascale_currentUser");
    }
    sessionStorage.setItem("adorascale_role", state.currentRole || "usuario");
}

function sortStateData() {
    // Sort songs by title
    state.songs.sort((a, b) => a.titulo.localeCompare(b.titulo));
    // Sort members by name
    state.members.sort((a, b) => a.nome.localeCompare(b.nome));
    // Sort schedules by date and time
    state.schedules.sort((a, b) => {
        const dateA = new Date(`${a.data}T${a.hora}`);
        const dateB = new Date(`${b.data}T${b.hora}`);
        return dateA - dateB;
    });
}

// Update the real date badge in header
function updateLiveDate() {
    const liveDateEl = document.getElementById("live-date");
    if (!liveDateEl) return;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    liveDateEl.textContent = today.toLocaleDateString('pt-BR', options);
}

// ==================== NAVIGATION ====================
function setupEventListeners() {
    // Tab switching
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const tabId = item.getAttribute("data-tab");
            switchTab(tabId);
        });
    });

    // Modal close listeners
    document.querySelectorAll(".modal-close, .btn-secondary[id$='-cancel']").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const modal = e.target.closest(".modal-overlay");
            if (modal) modal.classList.remove("active");
        });
    });

    // Song triggers
    document.getElementById("btn-nova-musica").addEventListener("click", () => openSongModal());
    document.getElementById("form-musica").addEventListener("submit", handleSongSubmit);
    document.getElementById("search-músicas").addEventListener("input", renderSongs);
    document.getElementById("filter-tom").addEventListener("change", renderSongs);

    // Member triggers
    document.getElementById("btn-novo-membro").addEventListener("click", () => openMemberModal());
    document.getElementById("form-membro").addEventListener("submit", handleMemberSubmit);
    document.getElementById("search-membros").addEventListener("input", renderMembers);

    // Schedule triggers
    document.getElementById("btn-nova-escala").addEventListener("click", () => openScaleModal());
    document.getElementById("form-escala").addEventListener("submit", handleScaleSubmit);
    document.getElementById("search-escalas").addEventListener("input", renderSchedules);

    // Backup actions
    document.getElementById("btn-exportar-backup").addEventListener("click", exportBackup);
    document.getElementById("import-file").addEventListener("change", importBackup);

    // Access management
    const accessForm = document.getElementById("form-acesso");
    if (accessForm) {
        accessForm.addEventListener("submit", handleAccessSubmit);
    }
    const resetAccessBtn = document.getElementById("btn-limpar-acesso");
    if (resetAccessBtn) {
        resetAccessBtn.addEventListener("click", resetAccessForm);
    }
    document.getElementById("btn-reset-demo").addEventListener("click", () => {
        if (confirm("Deseja realmente carregar os dados demonstrativos? Isso substituirá as alterações atuais.")) {
            localStorage.clear();
            loadState();
            renderAll();
            showToast("Dados demonstrativos recarregados!", "info");
        }
    });
    document.getElementById("btn-limpar-dados").addEventListener("click", () => {
        if (confirm("ATENÇÃO: Deseja apagar todos os dados permanentemente? Essa ação não pode ser desfeita.")) {
            state = {
                songs: [],
                members: [],
                schedules: [],
                users: buildDefaultUsers(),
                currentUser: null,
                currentRole: "usuario"
            };
            saveState();
            renderAll();
            showToast("Todos os dados foram apagados.", "danger");
        }
    });

    // Login triggers
    document.getElementById("btn-login-modal").addEventListener("click", toggleLoginState);
    document.getElementById("form-login").addEventListener("submit", handleLoginSubmit);
}

function switchTab(tabId) {
    // Toggle active classes on nav
    document.querySelectorAll(".nav-item").forEach(item => {
        if (item.getAttribute("data-tab") === tabId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Toggle active panes
    document.querySelectorAll(".tab-pane").forEach(pane => {
        if (pane.id === `tab-${tabId}`) {
            pane.classList.add("active");
        } else {
            pane.classList.remove("active");
        }
    });

    // Update Titles
    const titleEl = document.getElementById("current-tab-title");
    const subtitleEl = document.getElementById("current-tab-subtitle");
    
    const titles = {
        dashboard: { title: "Dashboard", subtitle: "Resumo das atividades e próximas escalas" },
        escalas: { title: "Escalas de Culto", subtitle: "Organize as equipes e setlists por data" },
        repertorio: { title: "Banco de Músicas", subtitle: "Catálogo de repertório e links rápidos de cifras" },
        equipe: { title: "Membros da Equipe", subtitle: "Gerencie os instrumentistas e funções dos voluntários" },
        configuracoes: { title: "Configurações", subtitle: "Ferramentas administrativas e backups" }
    };

    if (titles[tabId]) {
        titleEl.textContent = titles[tabId].title;
        subtitleEl.textContent = titles[tabId].subtitle;
    }

    // Render corresponding screen
    renderTab(tabId);
}

function renderTab(tabId) {
    if (tabId === "dashboard") renderDashboard();
    else if (tabId === "escalas") renderSchedules();
    else if (tabId === "repertorio") renderSongs();
    else if (tabId === "equipe") renderMembers();
    else if (tabId === "configuracoes") renderSettings();
}

function renderAll() {
    renderDashboard();
    renderSchedules();
    renderSongs();
    renderMembers();
    renderSettings();
}

// ==================== SETTINGS / ACCESS MANAGEMENT ====================
function renderSettings() {
    populateAccessMemberSelect();
    renderUserAccesses();
}

function populateAccessMemberSelect() {
    const select = document.getElementById("acesso-membro");
    if (!select) return;

    const currentValue = select.value || "";
    select.innerHTML = '<option value="">-- Nenhum vínculo --</option>';

    state.members.forEach(member => {
        const option = document.createElement("option");
        option.value = member.id;
        option.textContent = `${member.nome} (${member.funcoes.join(", ")})`;
        if (currentValue === member.id) option.selected = true;
        select.appendChild(option);
    });
}

function resetAccessForm() {
    const form = document.getElementById("form-acesso");
    if (!form) return;
    form.reset();
    document.getElementById("acesso-id").value = "";
    document.getElementById("acesso-role").value = "usuario";
    document.getElementById("acesso-membro").value = "";
}

function renderUserAccesses() {
    const container = document.getElementById("acessos-list");
    if (!container) return;

    container.innerHTML = "";

    if (!state.users || state.users.length === 0) {
        container.innerHTML = '<p class="text-secondary">Nenhum acesso cadastrado.</p>';
        return;
    }

    const list = document.createElement("div");
    list.className = "escalas-container";

    state.users.forEach(user => {
        const card = document.createElement("div");
        card.className = "escala-card";
        const member = state.members.find(item => item.id === user.memberId);
        card.innerHTML = `
            <div class="escala-header">
                <div class="escala-title-details">
                    <h3>${user.nome}</h3>
                    <div class="escala-meta">
                        <span><i data-lucide="user"></i> ${user.username}</span>
                        <span><i data-lucide="shield"></i> ${user.role === "administrador" ? "Administrador" : "Usuário"}</span>
                        ${member ? `<span><i data-lucide="users"></i> ${member.nome}</span>` : ""}
                    </div>
                </div>
                <div class="escala-card-actions">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="editAccessUser('${user.id}')">
                        <i data-lucide="edit-3"></i>
                        <span>Editar</span>
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="deleteAccessUser('${user.id}')">
                        <i data-lucide="trash-2"></i>
                        <span>Excluir</span>
                    </button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });

    container.appendChild(list);
    initLucide();
}

function editAccessUser(userId) {
    const user = state.users.find(item => item.id === userId);
    if (!user) return;

    const form = document.getElementById("form-acesso");
    if (!form) return;

    document.getElementById("acesso-id").value = user.id;
    document.getElementById("acesso-nome").value = user.nome;
    document.getElementById("acesso-usuario").value = user.username;
    document.getElementById("acesso-senha").value = user.password;
    document.getElementById("acesso-role").value = user.role;
    document.getElementById("acesso-telefone").value = user.telefone || "";
    document.getElementById("acesso-membro").value = user.memberId || "";

    document.getElementById("acesso-nome").focus();
}

function handleAccessSubmit(e) {
    e.preventDefault();

    const id = document.getElementById("acesso-id").value;
    const nome = document.getElementById("acesso-nome").value.trim();
    const username = document.getElementById("acesso-usuario").value.trim().toLowerCase();
    const password = document.getElementById("acesso-senha").value;
    const role = document.getElementById("acesso-role").value;
    const telefone = document.getElementById("acesso-telefone").value.trim();
    const memberId = document.getElementById("acesso-membro").value;

    if (!nome || !username || !password) {
        showToast("Preencha nome, usuário e senha para salvar o acesso.", "danger");
        return;
    }

    const duplicateUser = state.users.find(item => item.username.toLowerCase() === username && item.id !== id);
    if (duplicateUser) {
        showToast("Esse nome de usuário já existe.", "danger");
        return;
    }

    if (id) {
        const index = state.users.findIndex(item => item.id === id);
        if (index !== -1) {
            state.users[index] = { ...state.users[index], nome, username, password, role, telefone, memberId };
            showToast("Acesso atualizado com sucesso.", "success");
        }
    } else {
        state.users.push({
            id: `u_${Date.now()}`,
            nome,
            username,
            password,
            role,
            telefone,
            memberId
        });
        showToast("Novo acesso cadastrado com sucesso.", "success");
    }

    saveState();
    renderSettings();
    resetAccessForm();

    if (state.currentUser && state.currentUser.id === id) {
        state.currentUser = state.users.find(item => item.id === id) || null;
        state.currentRole = state.currentUser ? state.currentUser.role : "usuario";
        updateRoleUI();
    }
}

function deleteAccessUser(userId) {
    if (!confirm("Deseja realmente remover este acesso?")) return;

    const targetUser = state.users.find(item => item.id === userId);
    if (!targetUser) return;

    state.users = state.users.filter(item => item.id !== userId);
    saveState();

    if (state.currentUser && state.currentUser.id === userId) {
        state.currentUser = null;
        state.currentRole = "usuario";
        sessionStorage.removeItem("adorascale_currentUser");
        sessionStorage.removeItem("adorascale_role");
        updateRoleUI();
    }

    renderSettings();
    showToast("Acesso removido.", "info");
}

// ==================== TOAST SYSTEM ====================
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let iconName = "check-circle";
    if (type === "danger") iconName = "alert-circle";
    else if (type === "info") iconName = "info";
    else if (type === "warning") iconName = "alert-triangle";

    toast.innerHTML = `
        <i data-lucide="${iconName}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    initLucide();

    // Auto fade out
    setTimeout(() => {
        toast.classList.add("toast-fade-out");
        toast.addEventListener("animationend", () => toast.remove());
    }, 3500);
}

// ==================== DASHBOARD SECTION ====================
function renderDashboard() {
    // 1. Render Stats
    document.getElementById("stat-total-songs").textContent = state.songs.length;
    document.getElementById("stat-total-members").textContent = state.members.length;
    document.getElementById("stat-total-schedules").textContent = state.schedules.length;

    // Calculate most sung songs and top song
    const songCount = {};
    state.schedules.forEach(sc => {
        if (sc.setlist && Array.isArray(sc.setlist)) {
            sc.setlist.forEach(songId => {
                songCount[songId] = (songCount[songId] || 0) + 1;
            });
        }
    });

    const sortedSongsByUsage = Object.keys(songCount).map(id => {
        const song = state.songs.find(s => s.id === id);
        return {
            id,
            count: songCount[id],
            titulo: song ? song.titulo : "Música Removida",
            artista: song ? song.artista : "Desconhecido"
        };
    }).sort((a, b) => b.count - a.count);

    const topSong = sortedSongsByUsage[0];
    if (topSong) {
        document.getElementById("stat-top-song").textContent = topSong.titulo;
        document.getElementById("stat-top-song-count").textContent = `${topSong.count} ${topSong.count === 1 ? 'execução' : 'execuções'}`;
    } else {
        document.getElementById("stat-top-song").textContent = "Nenhuma";
        document.getElementById("stat-top-song-count").textContent = "0 execuções";
    }

    // 2. Render Most Sung List on Dashboard
    const mostSungContainer = document.getElementById("dashboard-most-sung-songs");
    mostSungContainer.innerHTML = "";
    
    if (sortedSongsByUsage.length === 0) {
        mostSungContainer.innerHTML = `<p class="text-secondary text-center">Nenhuma estatística disponível.</p>`;
    } else {
        const maxCount = sortedSongsByUsage[0].count;
        sortedSongsByUsage.slice(0, 4).forEach(item => {
            const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            const itemEl = document.createElement("div");
            itemEl.className = "most-sung-item";
            itemEl.innerHTML = `
                <div class="most-sung-meta">
                    <span class="most-sung-title">${item.titulo} <small class="text-muted">(${item.artista})</small></span>
                    <span class="most-sung-count">${item.count}x</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${pct}%"></div>
                </div>
            `;
            mostSungContainer.appendChild(itemEl);
        });
    }

    // 3. Render Upcoming Schedules (Today or Future) - Grouped by Month
    const timelineContainer = document.getElementById("dashboard-next-schedules");
    timelineContainer.innerHTML = "";

    const todayStr = new Date().toISOString().split('T')[0];
    let upcomingSchedules = state.schedules.filter(sc => sc.data >= todayStr);
    
    if (upcomingSchedules.length === 0) {
        const latestSchedules = state.schedules.slice(-3);
        if (latestSchedules.length === 0) {
            timelineContainer.innerHTML = `<p class="text-secondary text-center py-4">Nenhuma escala programada.</p>`;
        } else {
            upcomingSchedules = latestSchedules;
        }
    }

    const groupedByMonth = groupSchedulesByMonth(upcomingSchedules);
    Object.keys(groupedByMonth).sort().slice(0, 3).forEach(monthKey => {
        const monthHeader = document.createElement("div");
        monthHeader.className = "month-header";
        monthHeader.innerHTML = `<h4 style="color: var(--text-primary); font-size: 1rem; margin: 16px 0 12px 0; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">${monthKey}</h4>`;
        timelineContainer.appendChild(monthHeader);
        
        groupedByMonth[monthKey].forEach(sc => timelineContainer.appendChild(createTimelineItem(sc)));
    });
    
    initLucide();
}

function groupSchedulesByMonth(schedules) {
    const grouped = {};
    schedules.forEach(sc => {
        const dateObj = new Date(`${sc.data}T${sc.hora}`);
        const monthKey = dateObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/\b\w/g, l => l.toUpperCase());
        if (!grouped[monthKey]) grouped[monthKey] = [];
        grouped[monthKey].push(sc);
    });
    return grouped;
}

function createTimelineItem(sc) {
    const dateObj = new Date(`${sc.data}T${sc.hora}`);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    
    const div = document.createElement("div");
    div.className = "timeline-item";
    
    // Get lead initials or name
    const ministroObj = state.members.find(m => m.id === sc.ministro);
    const ministroName = ministroObj ? ministroObj.nome : "Sem Ministro";

    // Gather participants count
    const positions = ['ministro', 'teclado', 'violao', 'guitarra', 'baixo', 'bateria', 'vocal1', 'vocal2', 'vocal3', 'som', 'midia'];
    const activeParticipants = positions.map(pos => sc[pos]).filter(id => id);

    let avatarsHtml = "";
    activeParticipants.slice(0, 4).forEach(id => {
        const m = state.members.find(memb => memb.id === id);
        if (m) {
            const initials = m.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            avatarsHtml += `<div class="member-dot-avatar" title="${m.nome}">${initials}</div>`;
        }
    });

    if (activeParticipants.length > 4) {
        avatarsHtml += `<div class="member-dot-avatar" title="Mais ${activeParticipants.length - 4} participantes">+${activeParticipants.length - 4}</div>`;
    }

    div.innerHTML = `
        <div class="timeline-info">
            <div class="timeline-date-box">
                <span class="timeline-date-day">${day}</span>
                <span class="timeline-date-month">${month}</span>
            </div>
            <div class="timeline-details">
                <h4>${sc.tipo}</h4>
                <p><i data-lucide="clock"></i> ${sc.hora}h ${sc.obs ? `• ${sc.obs}` : ''}</p>
                <p style="margin-top: 4px; font-size: 0.8rem; color: var(--text-secondary)">
                    <strong>Ministro:</strong> ${ministroName} • <strong>Setlist:</strong> ${sc.setlist ? sc.setlist.length : 0} músicas
                </p>
            </div>
        </div>
        <div class="timeline-members-summary">
            ${avatarsHtml}
        </div>
    `;

    return div;
}

// ==================== SONG DIRECTORY (REPERTORIO) ====================
function renderSongs() {
    const tableBody = document.getElementById("músicas-list-table");
    const emptyState = document.getElementById("repertorio-empty");
    const searchQuery = document.getElementById("search-músicas").value.toLowerCase();
    const filterTom = document.getElementById("filter-tom").value;

    tableBody.innerHTML = "";

    // Count how many times each song has been sung
    const songUsage = {};
    state.schedules.forEach(sc => {
        if (sc.setlist) {
            sc.setlist.forEach(sid => {
                songUsage[sid] = (songUsage[sid] || 0) + 1;
            });
        }
    });

    const filteredSongs = state.songs.filter(song => {
        const matchesSearch = song.titulo.toLowerCase().includes(searchQuery) ||
                             song.artista.toLowerCase().includes(searchQuery) ||
                             song.tom.toLowerCase().includes(searchQuery);
        
        const matchesTom = !filterTom || song.tom === filterTom || song.tom.startsWith(filterTom);

        return matchesSearch && matchesTom;
    });

    if (filteredSongs.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
        filteredSongs.forEach(song => {
            const tr = document.createElement("tr");
            const usageCount = songUsage[song.id] || 0;

            tr.innerHTML = `
                <td>
                    <div class="song-title-cell">
                        <span>${song.titulo}</span>
                        ${song.observacoes ? `<small title="${song.observacoes}">${song.observacoes.substring(0, 45)}${song.observacoes.length > 45 ? '...' : ''}</small>` : ''}
                    </div>
                </td>
                <td>${song.artista}</td>
                <td><span class="tag-tom">${song.tom || 'N/A'}</span></td>
                <td>
                    <div class="link-group">
                        <a href="${song.linkDrive}" target="_blank" class="btn-link-action drive-link" title="Abrir Cifra no Drive">
                            <i data-lucide="file-text"></i>
                        </a>
                        <a href="${song.linkVideo}" target="_blank" class="btn-link-action video-link" title="Ouvir Música">
                            <i data-lucide="youtube"></i>
                        </a>
                    </div>
                </td>
                <td>
                    <span class="badge-round ${usageCount > 0 ? 'active' : ''}" title="Tocada ${usageCount} vezes">
                        ${usageCount}
                    </span>
                </td>
                <td class="admin-only">
                    <div class="escala-card-actions">
                        <button class="btn-link-action" onclick="openSongModal('${song.id}')" title="Editar">
                            <i data-lucide="edit-3"></i>
                        </button>
                        <button class="btn-link-action" onclick="deleteSong('${song.id}')" title="Excluir" style="color: var(--danger)">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    initLucide();
}

function openSongModal(songId = "") {
    const modal = document.getElementById("modal-musica");
    const form = document.getElementById("form-musica");
    form.reset();

    if (songId) {
        document.getElementById("modal-musica-title").textContent = "Editar Música";
        const song = state.songs.find(s => s.id === songId);
        if (song) {
            document.getElementById("musica-id").value = song.id;
            document.getElementById("musica-titulo").value = song.titulo;
            document.getElementById("musica-artista").value = song.artista;
            document.getElementById("musica-tom").value = song.tom;
            document.getElementById("musica-bpm").value = song.bpm || "";
            document.getElementById("musica-link-drive").value = song.linkDrive;
            document.getElementById("musica-link-video").value = song.linkVideo;
            document.getElementById("musica-observacoes").value = song.observacoes || "";
        }
    } else {
        document.getElementById("modal-musica-title").textContent = "Nova Música";
        document.getElementById("musica-id").value = "";
    }

    modal.classList.add("active");
}

function handleSongSubmit(e) {
    e.preventDefault();

    const id = document.getElementById("musica-id").value;
    const songData = {
        titulo: document.getElementById("musica-titulo").value.trim(),
        artista: document.getElementById("musica-artista").value.trim(),
        tom: document.getElementById("musica-tom").value.trim(),
        bpm: document.getElementById("musica-bpm").value ? parseInt(document.getElementById("musica-bpm").value) : null,
        linkDrive: document.getElementById("musica-link-drive").value.trim(),
        linkVideo: document.getElementById("musica-link-video").value.trim(),
        observacoes: document.getElementById("musica-observacoes").value.trim()
    };

    if (id) {
        // Edit mode
        const index = state.songs.findIndex(s => s.id === id);
        if (index !== -1) {
            state.songs[index] = { id, ...songData };
            showToast("Música atualizada com sucesso!");
        }
    } else {
        // Create mode
        const newSong = {
            id: 's_' + Date.now(),
            ...songData
        };
        state.songs.push(newSong);
        showToast("Música adicionada ao repertório!");
    }

    saveState();
    sortStateData();
    document.getElementById("modal-musica").classList.remove("active");
    renderSongs();
    renderDashboard();
}

function deleteSong(songId) {
    const song = state.songs.find(s => s.id === songId);
    if (!song) return;

    // Check if the song is currently used in any schedule
    const isUsed = state.schedules.some(sc => sc.setlist && sc.setlist.includes(songId));
    const confirmMsg = isUsed 
        ? `A música "${song.titulo}" está escalada em alguns cultos. Se você excluí-la, ela será removida dessas escalas também. Deseja continuar?`
        : `Deseja realmente excluir a música "${song.titulo}"?`;

    if (confirm(confirmMsg)) {
        // Remove from schedules setlists
        state.schedules.forEach(sc => {
            if (sc.setlist) {
                sc.setlist = sc.setlist.filter(id => id !== songId);
            }
        });

        // Remove from state songs
        state.songs = state.songs.filter(s => s.id !== songId);
        
        saveState();
        showToast("Música excluída com sucesso.", "info");
        renderSongs();
        renderDashboard();
    }
}

// ==================== MEMBERS MANAGEMENT (EQUIPE) ====================
function renderMembers() {
    const grid = document.getElementById("membros-list-grid");
    const emptyState = document.getElementById("equipe-empty");
    const searchQuery = document.getElementById("search-membros").value.toLowerCase();

    grid.innerHTML = "";

    const filteredMembers = state.members.filter(m => {
        return m.nome.toLowerCase().includes(searchQuery) ||
               m.funcoes.some(f => f.toLowerCase().includes(searchQuery));
    });

    if (filteredMembers.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
        filteredMembers.forEach(m => {
            const card = document.createElement("div");
            card.className = "member-card";

            const initials = m.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const badgesHtml = m.funcoes.map(f => `<span class="member-badge">${f}</span>`).join('');
            
            // Format phone for visual and wa.me link
            const rawPhone = m.telefone.replace(/\D/g, ''); // Numbers only
            const formattedPhone = formatPhoneNumber(m.telefone);
            const waLink = `https://wa.me/55${rawPhone}`;

            card.innerHTML = `
                <div class="member-card-header">
                    <div class="member-card-info">
                        <div class="member-avatar">${initials}</div>
                        <div class="member-card-details">
                            <h4>${m.nome}</h4>
                            <p><i data-lucide="phone"></i> ${formattedPhone}</p>
                        </div>
                    </div>
                </div>
                <div class="member-badges">
                    ${badgesHtml}
                </div>
                <div class="member-card-footer">
                    <a href="${waLink}" target="_blank" class="btn btn-secondary btn-sm btn-whatsapp" title="Enviar Mensagem">
                        <i data-lucide="message-square"></i>
                        <span>WhatsApp</span>
                    </a>
                    <div class="escala-card-actions admin-only">
                        <button class="btn-link-action" onclick="openMemberModal('${m.id}')" title="Editar">
                            <i data-lucide="edit-3"></i>
                        </button>
                        <button class="btn-link-action" onclick="deleteMember('${m.id}')" title="Excluir" style="color: var(--danger)">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    initLucide();
}

function formatPhoneNumber(phone) {
    const raw = phone.replace(/\D/g, '');
    if (raw.length === 11) {
        return `(${raw.substring(0, 2)}) ${raw.substring(2, 7)}-${raw.substring(7)}`;
    } else if (raw.length === 10) {
        return `(${raw.substring(0, 2)}) ${raw.substring(2, 6)}-${raw.substring(6)}`;
    }
    return phone;
}

function openMemberModal(memberId = "") {
    const modal = document.getElementById("modal-membro");
    const form = document.getElementById("form-membro");
    form.reset();

    if (memberId) {
        document.getElementById("modal-membro-title").textContent = "Editar Integrante";
        const member = state.members.find(m => m.id === memberId);
        if (member) {
            document.getElementById("membro-id").value = member.id;
            document.getElementById("membro-nome").value = member.nome;
            document.getElementById("membro-telefone").value = member.telefone;
            
            // Check correct checkboxes
            form.querySelectorAll("input[name='funcoes']").forEach(chk => {
                chk.checked = member.funcoes.includes(chk.value);
            });
        }
    } else {
        document.getElementById("modal-membro-title").textContent = "Novo Membro";
        document.getElementById("membro-id").value = "";
    }

    modal.classList.add("active");
}

function handleMemberSubmit(e) {
    e.preventDefault();

    const id = document.getElementById("membro-id").value;
    const nome = document.getElementById("membro-nome").value.trim();
    const telefone = document.getElementById("membro-telefone").value.trim();
    
    // Gather checked functions
    const funcoes = [];
    document.querySelectorAll("input[name='funcoes']:checked").forEach(chk => {
        funcoes.push(chk.value);
    });

    if (funcoes.length === 0) {
        alert("Selecione pelo menos uma função/instrumento para o membro.");
        return;
    }

    const memberData = { nome, telefone, funcoes };

    if (id) {
        const index = state.members.findIndex(m => m.id === id);
        if (index !== -1) {
            state.members[index] = { id, ...memberData };
            showToast("Integrante atualizado com sucesso!");
        }
    } else {
        const newMember = {
            id: 'm_' + Date.now(),
            ...memberData
        };
        state.members.push(newMember);
        showToast("Novo integrante cadastrado!");
    }

    saveState();
    sortStateData();
    document.getElementById("modal-membro").classList.remove("active");
    renderMembers();
    renderDashboard();
}

function deleteMember(memberId) {
    const member = state.members.find(m => m.id === memberId);
    if (!member) return;

    // Check if member is scheduled in any cult
    const scheduledCuts = state.schedules.filter(sc => {
        const positions = ['ministro', 'teclado', 'violao', 'guitarra', 'baixo', 'bateria', 'vocal1', 'vocal2', 'vocal3', 'som', 'midia'];
        return positions.some(pos => sc[pos] === memberId);
    });

    const isScheduled = scheduledCuts.length > 0;
    const confirmMsg = isScheduled
        ? `"${member.nome}" está escalado(a) em ${scheduledCuts.length} culto(s). Se você excluí-lo, ele será removido dessas escalas. Continuar?`
        : `Deseja realmente excluir "${member.nome}" da equipe?`;

    if (confirm(confirmMsg)) {
        // Remove from schedules roles
        state.schedules.forEach(sc => {
            const positions = ['ministro', 'teclado', 'violao', 'guitarra', 'baixo', 'bateria', 'vocal1', 'vocal2', 'vocal3', 'som', 'midia'];
            positions.forEach(pos => {
                if (sc[pos] === memberId) {
                    sc[pos] = "";
                }
            });
        });

        // Remove member
        state.members = state.members.filter(m => m.id !== memberId);
        
        saveState();
        showToast("Integrante removido.", "info");
        renderMembers();
        renderDashboard();
    }
}

// ==================== SCHEDULES CONTROL (ESCALAS) ====================
function renderSchedules() {
    const container = document.getElementById("escalas-list");
    const searchQuery = document.getElementById("search-escalas").value.toLowerCase();

    container.innerHTML = "";

    const filteredSchedules = state.schedules.filter(sc => {
        return sc.tipo.toLowerCase().includes(searchQuery) ||
               sc.data.toLowerCase().includes(searchQuery) ||
               (sc.obs && sc.obs.toLowerCase().includes(searchQuery));
    });

    if (filteredSchedules.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="calendar"></i>
                <h4>Nenhuma escala encontrada</h4>
                <p>Crie uma nova escala de culto para organizar a equipe e a setlist.</p>
            </div>
        `;
        initLucide();
        return;
    }

    // Group schedules by month
    const groupedByMonth = groupSchedulesByMonth(filteredSchedules);
    
    // Render each month
    Object.keys(groupedByMonth).sort().forEach(monthKey => {
        const monthHeader = document.createElement("div");
        monthHeader.className = "month-header";
        monthHeader.innerHTML = `<h3 style="color: var(--primary); font-size: 1.2rem; margin: 24px 0 16px 0; border-left: 4px solid var(--primary); padding-left: 12px;">${monthKey}</h3>`;
        container.appendChild(monthHeader);

        groupedByMonth[monthKey].forEach(sc => renderScheduleCard(container, sc));
    });

    initLucide();
}

function renderScheduleCard(container, sc) {
        const card = document.createElement("div");
        card.className = "escala-card";

        const dateObj = new Date(`${sc.data}T${sc.hora}`);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
        const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });

        // Map roles
        const getMemberName = (id) => {
            const m = state.members.find(memb => memb.id === id);
            return m ? m.nome : '<span class="text-muted" style="font-weight: normal; font-style: italic;">Não escalado</span>';
        };

        // Render team members
        const roles = [
            { label: "Ministro(a)", id: sc.ministro },
            { label: "Teclado", id: sc.teclado },
            { label: "Violão", id: sc.violao },
            { label: "Guitarra", id: sc.guitarra },
            { label: "Contra-baixo", id: sc.baixo },
            { label: "Bateria", id: sc.bateria },
            { label: "Vocal 1", id: sc.vocal1 },
            { label: "Vocal 2", id: sc.vocal2 },
            { label: "Vocal 3", id: sc.vocal3 },
            { label: "Som", id: sc.som },
            { label: "Mídia/Projeção", id: sc.midia }
        ];

        let teamGridHtml = "";
        // Ensure confirmacoes exists
        if (!sc.confirmacoes) sc.confirmacoes = {};

        roles.forEach(role => {
            const member = role.id ? state.members.find(m => m.id === role.id) : null;
            let nameHtml = "";
            let waBtnHtml = "";
            let confirmBadgeHtml = "";
            
            if (member) {
                nameHtml = member.nome;

                // Confirmation status
                const status = sc.confirmacoes[member.id] || "pendente";
                const statusConfig = {
                    pendente:     { icon: "clock",        label: "Pendente",     cssClass: "confirm-pendente" },
                    confirmado:   { icon: "check-circle", label: "Confirmado",   cssClass: "confirm-confirmado" },
                    indisponivel: { icon: "x-circle",     label: "Indisponível", cssClass: "confirm-indisponivel" }
                };
                const cfg = statusConfig[status];
                const currentMemberId = getCurrentUserMemberId();
                const isAdmin = state.currentRole === "administrador";
                const isOwnMember = !!(currentMemberId && currentMemberId === member.id);
                const canManageThis = isOwnMember || isAdmin;
                const clickHandler = canManageThis
                    ? `onclick="toggleConfirmation('${sc.id}', '${member.id}'); event.stopPropagation();"`
                    : "";
                const titleText = canManageThis 
                    ? (isAdmin ? `${cfg.label} — Clique para alterar (Adm)` : `${cfg.label} — Clique para alterar`)
                    : `${cfg.label} — Você só pode confirmar a própria presença`;
                confirmBadgeHtml = `
                    <button class="confirm-badge ${cfg.cssClass}" ${canManageThis ? clickHandler : ""} ${canManageThis ? "" : "disabled style=\"cursor:not-allowed; opacity:0.7;\""}
                            title="${titleText}">
                        <i data-lucide="${cfg.icon}" style="width:12px; height:12px;"></i>
                        <span>${cfg.label}</span>
                    </button>
                `;
                
                // Construct the customized WhatsApp message text
                const formattedDate = new Date(`${sc.data}T${sc.hora}`).toLocaleDateString('pt-BR');
                const setlistSongs = [];
                if (sc.setlist && sc.setlist.length > 0) {
                    sc.setlist.forEach((songId, idx) => {
                        const song = state.songs.find(s => s.id === songId);
                        if (song) {
                            setlistSongs.push(`${idx + 1}. ${song.titulo} (${song.tom})`);
                        }
                    });
                }
                const setlistStr = setlistSongs.length > 0 ? setlistSongs.join('\n') : 'A definir';
                
                const messageText = `Olá *${member.nome}*, você foi escalado(a) no ministério de louvor!\n\n` +
                    `📅 *Culto:* ${sc.tipo}${sc.obs ? ` (${sc.obs})` : ''}\n` +
                    `📆 *Data:* ${formattedDate} às ${sc.hora}h\n` +
                    `🎸 *Sua Função:* ${role.label}\n\n` +
                    `🎵 *Setlist:* \n${setlistStr}\n\n` +
                    `Confirme sua presença respondendo a esta mensagem. Deus abençoe! 🙌`;
                
                const rawPhone = member.telefone.replace(/\D/g, '');
                const waLink = `https://wa.me/55${rawPhone}?text=${encodeURIComponent(messageText)}`;
                
                waBtnHtml = `
                    <a href="${waLink}" target="_blank" class="escala-member-wa-btn admin-only" title="Enviar aviso individual por WhatsApp">
                        <i data-lucide="message-square" style="width: 12px; height: 12px;"></i>
                    </a>
                `;
            } else {
                nameHtml = '<span class="text-muted" style="font-weight: normal; font-style: italic;">Não escalado</span>';
            }

            teamGridHtml += `
                <div class="escala-member-item">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                        <span class="member-role">${role.label}</span>
                        ${waBtnHtml}
                    </div>
                    <span class="member-name">${nameHtml}</span>
                    ${confirmBadgeHtml}
                </div>
            `;
        });

        // Render Setlist
        let setlistHtml = "";
        if (!sc.setlist || sc.setlist.length === 0) {
            setlistHtml = `<p class="text-secondary" style="font-style: italic; font-size: 0.85rem;">Nenhuma música na setlist.</p>`;
        } else {
            sc.setlist.forEach((songId, index) => {
                const song = state.songs.find(s => s.id === songId);
                if (song) {
                    setlistHtml += `
                        <div class="escala-song-item">
                            <div class="escala-song-info">
                                <span class="escala-song-title">
                                    ${index + 1}. ${song.titulo}
                                    <span class="escala-song-tom">${song.tom}</span>
                                </span>
                                <span class="escala-song-artist">${song.artista}</span>
                            </div>
                            <div class="link-group">
                                <a href="${song.linkDrive}" target="_blank" class="btn-link-action drive-link" title="Abrir Cifra">
                                    <i data-lucide="file-text"></i>
                                </a>
                                <a href="${song.linkVideo}" target="_blank" class="btn-link-action video-link" title="Ouvir">
                                    <i data-lucide="youtube"></i>
                                </a>
                            </div>
                        </div>
                    `;
                }
            });
        }

        card.innerHTML = `
            <div class="escala-header">
                <div class="escala-date-info">
                    <div class="escala-day-badge">
                        ${day}
                        <span>${month}</span>
                    </div>
                    <div class="escala-title-details">
                        <h3>${sc.tipo}</h3>
                        <div class="escala-meta">
                            <span><i data-lucide="calendar"></i> ${capitalizeFirstLetter(weekday)}</span>
                            <span><i data-lucide="clock"></i> ${sc.hora}h</span>
                            ${sc.obs ? `<span><i data-lucide="info"></i> ${sc.obs}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="escala-card-actions admin-only">
                    <button class="btn btn-secondary btn-sm btn-whatsapp-share" onclick="shareFullScale('${sc.id}')" title="Enviar escala completa para o grupo">
                        <i data-lucide="share-2"></i>
                        <span>Enviar Grupo</span>
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="openScaleModal('${sc.id}')">
                        <i data-lucide="edit-3"></i>
                        <span>Editar</span>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteScale('${sc.id}')">
                        <i data-lucide="trash-2"></i>
                        <span>Excluir</span>
                    </button>
                </div>
            </div>
            ${sc.tema || sc.versiculos ? `
            <div class="escala-pregacao-section" style="background-color: rgba(99, 102, 241, 0.05); border-left: 4px solid var(--primary); padding: 12px; margin: 12px 0; border-radius: 4px;">
                ${sc.tema ? `<div style="margin-bottom: 8px;"><strong>📖 Tema:</strong> ${sc.tema}</div>` : ''}
                ${sc.versiculos ? `<div style="font-size: 0.9rem; color: var(--text-secondary);"><strong>✝️ Versículos:</strong> ${sc.versiculos}</div>` : ''}
            </div>
            ` : ''}
            <div class="escala-body">
                <div class="escala-team-section">
                    <h4>Equipe Escalada</h4>
                    <div class="escala-team-grid">
                        ${teamGridHtml}
                    </div>
                </div>
                <div class="escala-setlist-section">
                    <h4>Setlist do Culto</h4>
                    <div class="escala-setlist-list">
                        ${setlistHtml}
                    </div>
                </div>
            </div>
        `;

        container.appendChild(card);
    }

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Prepare scale creation modal selects & setlist choices
function populateScaleModalSelects() {
    // For each select in the form with .select-membro, gather qualified members or all members
    const selects = document.querySelectorAll(".select-membro");
    selects.forEach(select => {
        const targetFuncao = select.getAttribute("data-funcao");
        select.innerHTML = '<option value="">-- Selecione --</option>';

        // Filter members who perform this function
        const qualified = state.members.filter(m => m.funcoes.includes(targetFuncao));
        const others = state.members.filter(m => !m.funcoes.includes(targetFuncao));

        if (qualified.length > 0) {
            const groupQualified = document.createElement("optgroup");
            groupQualified.label = `${targetFuncao}s Recomendados`;
            qualified.forEach(m => {
                const opt = document.createElement("option");
                opt.value = m.id;
                opt.textContent = m.nome;
                groupQualified.appendChild(opt);
            });
            select.appendChild(groupQualified);
        }

        if (others.length > 0) {
            const groupOthers = document.createElement("optgroup");
            groupOthers.label = "Outros Integrantes";
            others.forEach(m => {
                const opt = document.createElement("option");
                opt.value = m.id;
                opt.textContent = m.nome;
                groupOthers.appendChild(opt);
            });
            select.appendChild(groupOthers);
        }
    });
}

function openScaleModal(scaleId = "") {
    const modal = document.getElementById("modal-escala");
    const form = document.getElementById("form-escala");
    form.reset();
    
    populateScaleModalSelects();

    if (scaleId) {
        document.getElementById("modal-escala-title").textContent = "Editar Escala de Culto";
        const sc = state.schedules.find(s => s.id === scaleId);
        if (sc) {
            document.getElementById("escala-id").value = sc.id;
            document.getElementById("escala-data").value = sc.data;
            document.getElementById("escala-hora").value = sc.hora;
            document.getElementById("escala-tipo").value = sc.tipo;
            document.getElementById("escala-obs").value = sc.obs || "";
            document.getElementById("escala-tema").value = sc.tema || "";
            document.getElementById("escala-versiculos").value = sc.versiculos || "";

            // Populate participants
            document.getElementById("escala-ministro").value = sc.ministro || "";
            document.getElementById("escala-teclado").value = sc.teclado || "";
            document.getElementById("escala-violao").value = sc.violao || "";
            document.getElementById("escala-guitarra").value = sc.guitarra || "";
            document.getElementById("escala-baixo").value = sc.baixo || "";
            document.getElementById("escala-bateria").value = sc.bateria || "";
            document.getElementById("escala-vocal1").value = sc.vocal1 || "";
            document.getElementById("escala-vocal2").value = sc.vocal2 || "";
            document.getElementById("escala-vocal3").value = sc.vocal3 || "";
            document.getElementById("escala-som").value = sc.som || "";
            document.getElementById("escala-midia").value = sc.midia || "";

            currentScaleSetlist = [...(sc.setlist || [])];
        }
    } else {
        document.getElementById("modal-escala-title").textContent = "Nova Escala de Culto";
        document.getElementById("escala-id").value = "";
        
        // Auto fill date with next Sunday or today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById("escala-data").value = today;
        document.getElementById("escala-hora").value = "19:00";
        currentScaleSetlist = [];
    }

    // Refresh setlist builders
    renderSetlistBuilder();
    modal.classList.add("active");
}

// ==================== CONFIRMATION TOGGLE ====================
function getRoleKeyForMember(sc, memberId) {
    const positions = ["ministro", "teclado", "violao", "guitarra", "baixo", "bateria", "vocal1", "vocal2", "vocal3", "som", "midia"];
    return positions.find(pos => sc[pos] === memberId) || null;
}

function getRoleLabel(roleKey) {
    const labels = {
        ministro: "Ministro(a)",
        teclado: "Teclado",
        violao: "Violão",
        guitarra: "Guitarra",
        baixo: "Contra-baixo",
        bateria: "Bateria",
        vocal1: "Vocal 1",
        vocal2: "Vocal 2",
        vocal3: "Vocal 3",
        som: "Som",
        midia: "Mídia"
    };
    return labels[roleKey] || "Função";
}

function notifyUnavailableMembers(sc, member) {
    const roleKey = getRoleKeyForMember(sc, member.id);
    const roleLabel = getRoleLabel(roleKey);
    const formattedDate = new Date(`${sc.data}T${sc.hora}`).toLocaleDateString("pt-BR");
    const messageText = `Olá! O membro ${member.nome} marcou indisponibilidade para a escala de ${sc.tipo} (${formattedDate} às ${sc.hora}h) na função ${roleLabel}. Por favor, confirme o ajuste da equipe.`;

    const positions = roleKey && roleKey.startsWith("vocal") ? ["vocal1", "vocal2", "vocal3"] : roleKey ? [roleKey] : [];
    const recipients = [];

    state.members.forEach(candidate => {
        if (candidate.id === member.id) return;
        const isSameRole = positions.some(pos => sc[pos] === candidate.id);
        if (isSameRole) recipients.push(candidate);
    });

    state.users.filter(user => user.role === "administrador").forEach(user => {
        const recipientPhone = user.telefone;
        if (recipientPhone) {
            recipients.push({ id: `user:${user.id}`, nome: user.nome, telefone: recipientPhone });
        }
    });

    const uniqueRecipients = recipients.filter((recipient, index, arr) => arr.findIndex(item => item.id === recipient.id) === index);

    uniqueRecipients.forEach(recipient => {
        const rawPhone = (recipient.telefone || "").replace(/\D/g, "");
        if (!rawPhone) return;
        const waLink = `https://wa.me/55${rawPhone}?text=${encodeURIComponent(messageText)}`;
        window.open(waLink, "_blank", "noopener,noreferrer");
    });

    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Indisponibilidade registrada", {
            body: "Uma mensagem foi enviada para os colegas da função e para o administrador."
        });
    } else if ("Notification" in window && Notification.permission !== "denied") {
        Notification.requestPermission().catch(() => {});
    }
}

function toggleConfirmation(scaleId, memberId) {
    const sc = state.schedules.find(s => s.id === scaleId);
    if (!sc) return;

    const member = state.members.find(m => m.id === memberId);
    if (!member) return;

    const isAdmin = state.currentRole === "administrador";
    const currentMemberId = getCurrentUserMemberId();
    const isOwnMember = !!currentMemberId && currentMemberId === memberId;

    if (!isAdmin && !isOwnMember) {
        showToast("Você só pode confirmar a própria presença.", "danger");
        return;
    }

    if (!sc.confirmacoes) sc.confirmacoes = {};

    const cycle = ["pendente", "confirmado", "indisponivel"];
    const current = sc.confirmacoes[memberId] || "pendente";
    const nextIndex = (cycle.indexOf(current) + 1) % cycle.length;
    sc.confirmacoes[memberId] = cycle[nextIndex];

    saveState();
    renderSchedules();
    renderDashboard();

    const labels = { pendente: "Pendente", confirmado: "Confirmado", indisponivel: "Indisponível" };
    showToast(`Status alterado para: ${labels[cycle[nextIndex]]}`, "info");

    if (cycle[nextIndex] === "indisponivel") {
        notifyUnavailableMembers(sc, member);
    }
}

// ==================== SETLIST DROPDOWN BUILD ====================
function renderSetlistBuilder() {
    populateSetlistDropdown();
    renderSetlistBuilderSelected();
}

function populateSetlistDropdown() {
    const datalist = document.getElementById("setlist-songs-list");
    const searchInput = document.getElementById("setlist-song-search");
    if (!datalist || !searchInput) return;

    datalist.innerHTML = "";
    const available = state.songs.filter(song => !currentScaleSetlist.includes(song.id));

    available.forEach(song => {
        const opt = document.createElement("option");
        opt.value = `${song.titulo} — ${song.artista} (${song.tom})`;
        datalist.appendChild(opt);
    });

    if (!searchInput.value) {
        searchInput.value = "";
    }
}

function getSongFromSearchValue(searchValue) {
    const normalizedQuery = searchValue.trim().toLowerCase();
    if (!normalizedQuery) return null;

    const song = state.songs.find(item => item.titulo.toLowerCase() === normalizedQuery || item.artista.toLowerCase() === normalizedQuery);
    if (song) return song;

    return state.songs.find(item => item.titulo.toLowerCase().includes(normalizedQuery) || item.artista.toLowerCase().includes(normalizedQuery) || item.tom.toLowerCase().includes(normalizedQuery)) || null;
}

function addSongFromDropdown() {
    const searchInput = document.getElementById("setlist-song-search");
    if (!searchInput) return;
    const song = getSongFromSearchValue(searchInput.value);
    if (!song) return;

    if (!currentScaleSetlist.includes(song.id)) {
        currentScaleSetlist.push(song.id);
        searchInput.value = "";
        renderSetlistBuilder();
    }
}

function renderSetlistBuilderSelected() {
    const listContainer = document.getElementById("setlist-selected-list");
    const emptyMsg = document.getElementById("setlist-selected-empty");
    if (!listContainer || !emptyMsg) return;
    
    listContainer.innerHTML = "";

    if (currentScaleSetlist.length === 0) {
        emptyMsg.classList.remove("hidden");
        return;
    }

    emptyMsg.classList.add("hidden");

    currentScaleSetlist.forEach((songId, index) => {
        const song = state.songs.find(s => s.id === songId);
        if (!song) return;

        const div = document.createElement("div");
        div.className = "selection-song-card selected-item";
        
        div.innerHTML = `
            <div>
                <span class="selection-song-title">${index + 1}. ${song.titulo}</span>
                <span class="selection-song-artist">${song.artista} · ${song.tom}</span>
            </div>
            <div class="song-order-actions">
                <button type="button" class="btn-order" onclick="moveSongInSetlist(${index}, -1); event.stopPropagation();" ${index === 0 ? 'disabled style="opacity:0.2"' : ''}>
                    <i data-lucide="chevron-up" style="width:14px; height:14px"></i>
                </button>
                <button type="button" class="btn-order" onclick="moveSongInSetlist(${index}, 1); event.stopPropagation();" ${index === currentScaleSetlist.length - 1 ? 'disabled style="opacity:0.2"' : ''}>
                    <i data-lucide="chevron-down" style="width:14px; height:14px"></i>
                </button>
                <button type="button" class="btn-add-remove" onclick="removeSongFromScaleSetlist('${song.id}'); event.stopPropagation();" title="Remover" style="color: var(--danger)">
                    <i data-lucide="x" style="width:14px; height:14px"></i>
                </button>
            </div>
        `;
        listContainer.appendChild(div);
    });

    initLucide();
}

function addSongToScaleSetlist(songId) {
    if (!currentScaleSetlist.includes(songId)) {
        currentScaleSetlist.push(songId);
        renderSetlistBuilder();
    }
}

function removeSongFromScaleSetlist(songId) {
    currentScaleSetlist = currentScaleSetlist.filter(id => id !== songId);
    renderSetlistBuilder();
}

function moveSongInSetlist(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentScaleSetlist.length) return;
    
    // Swap
    const temp = currentScaleSetlist[index];
    currentScaleSetlist[index] = currentScaleSetlist[targetIndex];
    currentScaleSetlist[targetIndex] = temp;
    
    renderSetlistBuilderSelected();
}

function handleScaleSubmit(e) {
    e.preventDefault();

    const id = document.getElementById("escala-id").value;
    const scaleData = {
        data: document.getElementById("escala-data").value,
        hora: document.getElementById("escala-hora").value,
        tipo: document.getElementById("escala-tipo").value,
        obs: document.getElementById("escala-obs").value.trim(),
        tema: document.getElementById("escala-tema").value.trim(),
        versiculos: document.getElementById("escala-versiculos").value.trim(),
        
        ministro: document.getElementById("escala-ministro").value,
        teclado: document.getElementById("escala-teclado").value,
        violao: document.getElementById("escala-violao").value,
        guitarra: document.getElementById("escala-guitarra").value,
        baixo: document.getElementById("escala-baixo").value,
        bateria: document.getElementById("escala-bateria").value,
        vocal1: document.getElementById("escala-vocal1").value,
        vocal2: document.getElementById("escala-vocal2").value,
        vocal3: document.getElementById("escala-vocal3").value,
        som: document.getElementById("escala-som").value,
        midia: document.getElementById("escala-midia").value,
        
        setlist: [...currentScaleSetlist]
    };

    if (id) {
        const index = state.schedules.findIndex(sc => sc.id === id);
        if (index !== -1) {
            // Preserve existing confirmacoes
            const existingConfirmacoes = state.schedules[index].confirmacoes || {};
            state.schedules[index] = { id, ...scaleData, confirmacoes: existingConfirmacoes };
            showToast("Escala de culto atualizada!");
        }
    } else {
        // Initialize confirmacoes for all assigned members as pendente
        const confirmacoes = {};
        const positions = ['ministro', 'teclado', 'violao', 'guitarra', 'baixo', 'bateria', 'vocal1', 'vocal2', 'vocal3', 'som', 'midia'];
        positions.forEach(pos => {
            if (scaleData[pos]) {
                confirmacoes[scaleData[pos]] = "pendente";
            }
        });
        const newScale = {
            id: 'sc_' + Date.now(),
            ...scaleData,
            confirmacoes
        };
        state.schedules.push(newScale);
        showToast("Escala criada com sucesso!");
    }

    saveState();
    sortStateData();
    document.getElementById("modal-escala").classList.remove("active");
    renderSchedules();
    renderDashboard();
}

function deleteScale(scaleId) {
    if (confirm("Deseja realmente excluir esta escala de culto?")) {
        state.schedules = state.schedules.filter(s => s.id !== scaleId);
        saveState();
        showToast("Escala excluída.", "info");
        renderSchedules();
        renderDashboard();
    }
}

// ==================== SETTINGS (BACKUP) ====================
function exportBackup() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute("download", `Backup_AdoraScale_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    showToast("Backup exportado com sucesso!");
}

function importBackup(e) {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = function(event) {
        try {
            const importedState = JSON.parse(event.target.result);
            
            // Basic structure validation
            if (importedState.songs && importedState.members && importedState.schedules) {
                state = importedState;
                saveState();
                sortStateData();
                renderAll();
                showToast("Backup importado com sucesso!", "success");
            } else {
                showToast("Arquivo de backup inválido. Chaves esperadas não encontradas.", "danger");
            }
        } catch (err) {
            showToast("Erro ao processar o arquivo de backup.", "danger");
        }
    };
    fileReader.readAsText(file);
    // Reset file input
    e.target.value = "";
}

// ==================== WHATSAPP GROUP SHARING ====================
function shareFullScale(scaleId) {
    const sc = state.schedules.find(s => s.id === scaleId);
    if (!sc) return;

    const formattedDate = new Date(`${sc.data}T${sc.hora}`).toLocaleDateString('pt-BR');
    
    // Gather filled positions
    const getMemberNameText = (id) => {
        const m = state.members.find(memb => memb.id === id);
        return m ? m.nome : 'Não escalado';
    };

    const rolesList = [
        { label: "Ministro(a)", name: getMemberNameText(sc.ministro) },
        { label: "Teclado", name: getMemberNameText(sc.teclado) },
        { label: "Violão", name: getMemberNameText(sc.violao) },
        { label: "Guitarra", name: getMemberNameText(sc.guitarra) },
        { label: "Contra-baixo", name: getMemberNameText(sc.baixo) },
        { label: "Bateria", name: getMemberNameText(sc.bateria) },
        { label: "Vocal 1", name: getMemberNameText(sc.vocal1) },
        { label: "Vocal 2", name: getMemberNameText(sc.vocal2) },
        { label: "Vocal 3", name: getMemberNameText(sc.vocal3) },
        { label: "Som", name: getMemberNameText(sc.som) },
        { label: "Mídia/Projeção", name: getMemberNameText(sc.midia) }
    ].filter(r => r.name !== 'Não escalado');

    let teamStr = "";
    rolesList.forEach(r => {
        teamStr += `• *${r.label}:* ${r.name}\n`;
    });

    const setlistSongs = [];
    if (sc.setlist && sc.setlist.length > 0) {
        sc.setlist.forEach((songId, idx) => {
            const song = state.songs.find(s => s.id === songId);
            if (song) {
                setlistSongs.push(`${idx + 1}. ${song.titulo} (${song.tom})`);
            }
        });
    }
    const setlistStr = setlistSongs.length > 0 ? setlistSongs.join('\n') : 'A definir';

    const messageText = `🎸 *ESCALA DE LOUVOR* 🎸\n\n` +
        `📅 *Culto:* ${sc.tipo}${sc.obs ? ` (${sc.obs})` : ''}\n` +
        `📆 *Data:* ${formattedDate} às ${sc.hora}h\n\n` +
        `👥 *EQUIPE ESCALADA:*\n${teamStr}\n` +
        `🎵 *SETLIST:*\n${setlistStr}\n\n` +
        `Favor confirmar presença! Deus abençoe! 🙌`;

    const waLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
    window.open(waLink, '_blank');
}

