// --- START: Configuration Placeholders ---
// These values will be replaced by Netlify's build process using environment variables.
const firebaseConfig = {
    apiKey: "__FIREBASE_API_KEY__",
    authDomain: "__FIREBASE_AUTH_DOMAIN__",
    projectId: "__FIREBASE_PROJECT_ID__",
    storageBucket: "__FIREBASE_STORAGE_BUCKET__",
    messagingSenderId: "__FIREBASE_MESSAGING_SENDER_ID__",
    appId: "__FIREBASE_APP_ID__",
    measurementId: "__FIREBASE_MEASUREMENT_ID__"
};

const SERVER_URL = "__SERVER_URL__";
// --- END: Configuration Placeholders ---

// --- START: Runtime Configuration Check ---
// Verify that the placeholders were replaced during the build.
if (firebaseConfig.apiKey.startsWith("__") || SERVER_URL.startsWith("__")) {
    console.error(
        "FATAL ERROR: Application is not configured correctly. Environment variables were not injected during build."
    );
    // Display a user-friendly error message
    const body = document.querySelector('body');
    if (body) {
        body.innerHTML = `
        <div style="padding: 30px; text-align: center; color: #ff3b30; background-color: #111; height: 100vh; display: flex; align-items: center; justify-content: center;">
            <h1>Lỗi Cấu Hình</h1>
            <p>Không thể tải ứng dụng do lỗi cấu hình phía máy chủ. Vui lòng liên hệ quản trị viên.</p>
            <p>(Error: Environment variables not injected)</p>
        </div>`;
    }
    // Prevent the rest of the script from running
    throw new Error("Environment variables not injected during build.");
}
// --- END: Runtime Configuration Check ---

// Initialize Firebase *FIRST*
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
// const db = firebase.firestore(); // Uncomment if you use Firestore directly

// Define PING_URL and other related constants *AFTER* checks and init
const PING_URL = SERVER_URL; // <- Di chuyển xuống đây
const PING_INTERVAL_MS = 10 * 60 * 1000;
let socket;

// DOM Elements
const entryWarningModal = document.getElementById('entryWarningModal');
const acceptWarningBtn = document.getElementById('acceptWarningBtn');
const authModal = document.getElementById('authModal');
const loginTabBtn = document.querySelector('.tab-link[data-tab="login"]');
const registerTabBtn = document.querySelector('.tab-link[data-tab="register"]');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginErrorEl = document.getElementById('loginError');
const loginBtn = document.getElementById('loginBtn');
const registerUsernameInput = document.getElementById('registerUsername');
const registerEmailInput = document.getElementById('registerEmail');
const registerPasswordInput = document.getElementById('registerPassword');
const registerErrorEl = document.getElementById('registerError');
const registerBtn = document.getElementById('registerBtn');
const playGuestBtn = document.getElementById('playGuestBtn');
const gameWrapper = document.querySelector('.game-wrapper');
const authStatusDiv = document.getElementById('authStatus');
const loggedOutView = authStatusDiv.querySelector('.logged-out-view');
const loggedInView = authStatusDiv.querySelector('.logged-in-view');
const showAuthModalBtn = document.getElementById('showAuthModalBtn');
const logoutBtn = document.getElementById('logoutBtn');
const currentUserAvatarEl = document.getElementById('currentUserAvatar');
const currentUsernameEl = document.getElementById('currentUsername');
const userPointsEl = document.getElementById('userPoints');
const headerButtons = document.querySelector('.header-buttons');
const toggleMusicBtn = document.getElementById('toggleMusicBtn');
const infoBtn = document.getElementById('infoBtn');
const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
const settingsBtn = document.getElementById('settingsBtn');
const sessionStatusEl = document.getElementById('sessionStatus');
const betAmountInput = document.getElementById('betAmount');
const betTaiButton = document.getElementById('betTai');
const betXiuButton = document.getElementById('betXiu');
const currentBetMessageEl = document.getElementById('currentBetMessage');
const resultMessageEl = document.getElementById('resultMessage');
const centerDisplayEl = document.getElementById('centerDisplay');
const timerAreaEl = document.getElementById('timerArea');
const timerLabelEl = document.getElementById('timerLabel');
const timerEl = document.getElementById('timer');
const resultAreaEl = document.getElementById('resultArea');
const dice1El = document.getElementById('dice1');
const dice2El = document.getElementById('dice2');
const dice3El = document.getElementById('dice3');
const diceSumEl = document.getElementById('diceSum');
const gameOutcomeEl = document.getElementById('gameOutcome');
const resultCoverEl = document.getElementById('resultCover');
const skipCountdownBtn = document.getElementById('skipCountdownBtn');
const historyRowEl = document.getElementById('historyRow');
const cancelBetBtn = document.getElementById('cancelBetBtn');
const leaderboardList = document.getElementById('leaderboardList');
const historyPanelWrapperEl = document.getElementById('historyPanelWrapper');
const historyListEl = document.getElementById('historyList');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const settingsModalWrapperEl = document.getElementById('settingsModalWrapper');
const settingsPanelEl = document.getElementById('settingsPanel');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const infoModalWrapperEl = document.getElementById('infoModalWrapper');
const infoPanel = document.getElementById('infoPanel');
const closeInfoBtn = document.getElementById('closeInfoBtn');
const newUsernameInput = document.getElementById('newUsernameInput');
const avatarSelectionContainer = document.getElementById('avatarSelectionContainer');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const devPasswordSection = document.getElementById('devPasswordSection');
const devPasswordInput = document.getElementById('devPasswordInput');
const unlockDevBtn = document.getElementById('unlockDevBtn');
const developerSettingsArea = document.getElementById('developerSettingsArea');
const sessionDurationInput = document.getElementById('sessionDurationInput');
const devSetPointsInput = document.getElementById('devSetPointsInput');
const devSetPointsBtn = document.getElementById('devSetPointsBtn');
const skipSongBtn = document.getElementById('skipSongBtn');
const gameOverMessageEl = document.getElementById('gameOverMessage');
const restartGameBtn = document.getElementById('restartGameBtn');
const congratsModalWrapper = document.getElementById('congratsModal');
const congratsPanel = document.querySelector('.congrats-panel');
const congratsUidEl = document.getElementById('congratsUid');
const congratsUsernameEl = congratsPanel?.querySelector('p:nth-of-type(4) span'); // Might need adjustment if HTML changes
const closeCongratsBtnConfirm = document.getElementById('closeCongratsBtnConfirm');
const chatArea = document.getElementById('chatArea');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const sendVerificationBtn = document.getElementById('sendVerificationBtn');
const verificationStatusMessageEl = document.getElementById('verificationStatusMessage');
const devSongSelect = document.getElementById('devSongSelect');
const devPlaySongBtn = document.getElementById('devPlaySongBtn');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const newMessagesIndicator = document.getElementById('newMessagesIndicator');

// Transfer Points Elements
const transferPointsBtn = document.getElementById('transferPointsBtn');
const transferModalWrapper = document.getElementById('transferModalWrapper');
const transferPanel = document.getElementById('transferPanel');
const closeTransferModalBtn = document.getElementById('closeTransferModalBtn');
const myUidDisplay = document.getElementById('myUidDisplay');
const copyUidBtn = document.getElementById('copyUidBtn');
const copyStatusMsg = document.getElementById('copyStatusMsg');
const sendPointsSection = document.getElementById('sendPointsSection');
const recipientUidInput = document.getElementById('recipientUidInput');
const transferAmountInput = document.getElementById('transferAmountInput');
const transferErrorMsg = document.getElementById('transferErrorMsg');
const confirmTransferBtn = document.getElementById('confirmTransferBtn');
const transferNotAllowedMsg = document.getElementById('transferNotAllowedMsg');


// Game State & User Data
let currentUser = null;
let localUser = { userId: null, username: "Khách", points: 0, avatarClass: 'fas fa-user-ninja', isGuest: true, isVerified: false, isSuperVerified: false, isDev: false };
let currentBetState = { choice: null, amount: 0, confirmed: false };
let isBettingAllowed = false;
let gameHistory = [];
let serverHistoryCache = [];
let currentSessionCount = 0;
let localTimerInterval = null;
let waitInterval = null;
let hasRevealedLocally = false;
let isGameInitialized = false;
let hasShownCongratsPopup = false;
let gameStatus = "CONNECTING";
let isDraggingCover = false; let coverStartX, coverStartY; let coverOffsetX, coverOffsetY;

// Constants
const MAX_SIMPLE_HISTORY = 15;
const MAX_LOCAL_HISTORY = 50;
const MAX_DETAILED_HISTORY_DISPLAY = 20;
const DEV_PASSWORD = 'nhacaiducanh';
const CONGRATS_THRESHOLD = 40000;
const GUEST_INITIAL_POINTS = 100;
const REGISTER_INITIAL_POINTS = 100;
const VERIFICATION_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const MIN_TRANSFER_AMOUNT = 50;
const MIN_POINTS_AFTER_TRANSFER = 500;

let lastVerificationRequestTime = 0;
let verificationCooldownTimer = null;

// Music
const musicFiles = ['music/1.mp3', 'music/2.mp3', 'music/3.mp3', 'music/4.mp3', 'music/5.mp3', 'music/6.mp3'];
let audioPlayer = new Audio();
let isMuted = localStorage.getItem('txMuted') === 'true';
let hasMusicStarted = false;
let currentServerSongPath = null;
let audioLoadPromise = null;

// --- Utility Functions ---
function showModal(modalElement) { if(modalElement) { modalElement.style.display = 'flex'; modalElement.classList.add('show'); } }
function hideModal(modalElement) { if(modalElement) { modalElement.style.display = 'none'; modalElement.classList.remove('show'); } }
function showElement(el) { if(el) { if(el.classList.contains('chat-area')) el.style.display = 'flex'; else el.style.display = 'block'; } }
function hideElement(el) { if(el) el.style.display = 'none'; }
function showTemporaryMessage(element, message, className = 'info', duration = 3000) {
    if (!element) return;
    element.textContent = message;
    // Ensure correct class application
    element.className = ''; // Reset classes first
    element.classList.add(className); // Add win/loss/no-bet class
    if (!['win', 'loss', 'no-bet'].includes(className)) {
        element.classList.add('info-message'); // Add general info style if not win/loss/no-bet
        if (element === copyStatusMsg || element === transferErrorMsg) { // Specific smaller style
             element.classList.add('small-info');
        }
    }
    element.style.display = 'block'; // Ensure it's visible

    // Clear message after duration if it's not a permanent status like verification
    if (element !== verificationStatusMessageEl) {
        setTimeout(() => {
             if (element.textContent === message) { // Only clear if the message hasn't changed
                 element.textContent = '';
                 element.style.display = 'none';
             }
        }, duration);
    }
 }


// --- Authentication & User Management ---
async function getIdToken() {
    if (auth.currentUser) {
        try {
            // Force refresh token if needed
            return await auth.currentUser.getIdToken(true);
        } catch (error) {
            console.error("Error getting ID token:", error);
            alert("Lỗi xác thực người dùng. Vui lòng đăng nhập lại.");
            handleLogout();
            return null;
        }
    }
    return null;
}

function togglePasswordVisibility(event) {
    const button = event.currentTarget;
    const targetInputId = button.dataset.target;
    const passwordInput = document.getElementById(targetInputId);
    const icon = button.querySelector('i');
    if (passwordInput && icon) {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
        button.setAttribute('title', type === 'password' ? 'Hiện mật khẩu' : 'Ẩn mật khẩu');
    }
}

function switchAuthTab(tabName) { const isActive = tabName === 'login'; loginTabBtn?.classList.toggle('active', isActive); registerTabBtn?.classList.toggle('active', !isActive); loginTab?.classList.toggle('active', isActive); registerTab?.classList.toggle('active', !isActive); if(loginErrorEl) loginErrorEl.textContent = ''; if(registerErrorEl) registerErrorEl.textContent = ''; }
function handleLogin(event) { if (event) event.preventDefault(); const email = loginEmailInput.value; const password = loginPasswordInput.value; if(loginErrorEl) loginErrorEl.textContent = ''; if(loginBtn) loginBtn.disabled = true; auth.signInWithEmailAndPassword(email, password).then((userCredential) => { console.log("Firebase Login Success:", userCredential.user.uid); hideModal(authModal); }).catch((error) => { console.error("Login Error:", error); let message = "Đăng nhập thất bại."; if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') { message = "Email hoặc mật khẩu không đúng."; } else if (error.code === 'auth/invalid-email') { message = "Địa chỉ email không hợp lệ."; } if(loginErrorEl) loginErrorEl.textContent = message; }).finally(() => { if(loginBtn) loginBtn.disabled = false; }); }
function handleRegister(event) { if (event) event.preventDefault(); const username = registerUsernameInput.value.trim(); const email = registerEmailInput.value; const password = registerPasswordInput.value; if(registerErrorEl) registerErrorEl.textContent = ''; if (!username || username.length > 15) { if(registerErrorEl) registerErrorEl.textContent = 'Tên hiển thị không hợp lệ (1-15 ký tự).'; return; } if (password.length < 6) { if(registerErrorEl) registerErrorEl.textContent = 'Mật khẩu phải có ít nhất 6 ký tự.'; return; } if(registerBtn) registerBtn.disabled = true; auth.createUserWithEmailAndPassword(email, password).then((userCredential) => { const user = userCredential.user; console.log("Firebase User registered:", user.uid); hideModal(authModal); }).catch((error) => { console.error("Registration Error:", error); let message = "Đăng ký thất bại."; if (error.code === 'auth/email-already-in-use') { message = "Địa chỉ email này đã được sử dụng."; } else if (error.code === 'auth/weak-password') { message = "Mật khẩu quá yếu."; } else if (error.code === 'auth/invalid-email') { message = "Địa chỉ email không hợp lệ."; } if(registerErrorEl) registerErrorEl.textContent = message; }).finally(() => { if(registerBtn) registerBtn.disabled = false; }); }
function handleLogout() { auth.signOut().then(() => { console.log("Firebase Logout Success"); }).catch((error) => console.error("Logout Error:", error)); }
function handlePlayGuest() { hideModal(authModal); if (auth.currentUser) { handleLogout(); } else { if(socket && socket.connected) { socket.emit('userLoggedOut'); } setupGuestUI(); updateUIAfterAuthChange(); // Ensure UI updates correctly for guest
            showGameAndInitializeIfNeeded(); } }

auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    const wasGuestInitially = localUser.isGuest; // Track initial state

    if (user) {
        console.log("Auth state changed: User logged in -", user.uid);
        const idToken = await getIdToken();
        if (idToken && socket && socket.connected) {
            console.log("Notifying server of login with token.");
            socket.emit('userLoggedIn', { token: idToken });
        } else if (!socket || !socket.connected) {
            console.warn("Socket not connected when auth state changed to logged in.");
        } else if (!idToken) {
             console.error("Could not get ID Token on auth change.");
        }
        hideModal(authModal);
        // UI update will be handled by userUpdate or subsequent calls
        showGameAndInitializeIfNeeded();
    } else {
        console.log("Auth state changed: User logged out");
        if (socket && socket.connected) { console.log("Notifying server of logout"); socket.emit('userLoggedOut'); }
        setupGuestUI(); // This sets localUser to guest defaults
        updateChatVisibility();
        updateUIAfterAuthChange(); // Update UI based on the new guest state
        if(isGameInitialized) {
            updatePointsDisplay(); // Update points display for guest
            if(chatMessages) chatMessages.innerHTML = ''; // Clear chat
        }
        serverHistoryCache = [];
        gameHistory = [];
        updateSimpleHistoryDisplay();
        audioPlayer.pause();
        audioPlayer.src = "";
        currentServerSongPath = null;
        hasMusicStarted = false;
    }
});

// --- UI Update Functions ---

// Updates header, points, transfer button visibility based on login status
function updateUIAfterAuthChange() {
    updateHeaderDisplay(); // Shows/hides login/logout buttons, username, avatar
    updatePointsDisplay(); // Updates the points display
    if (!localUser.isGuest) {
        showElement(transferPointsBtn); // Show transfer button if logged in
    } else {
        hideElement(transferPointsBtn); // Hide transfer button if guest or logged out
        hideModal(transferModalWrapper); // Close transfer modal on logout/guest
    }
    updateTransferModalState(); // Update transfer modal content visibility
    updateChatVisibility(); // Update chat based on verification
    updateVerificationStatusUI(); // Update verification status in settings
}


function updateChatVisibility() { if (!chatArea || !chatInput || !chatSendBtn) return; if (localUser.isGuest) { hideElement(chatArea); chatInput.disabled = true; chatSendBtn.disabled = true; chatInput.placeholder = "Đăng nhập để chat..."; } else if (!localUser.isVerified) { showElement(chatArea); chatArea.style.opacity = '1'; chatArea.classList.add('visible'); chatInput.disabled = true; chatSendBtn.disabled = true; chatInput.placeholder = "Xác thực email để chat..."; } else { showElement(chatArea); chatArea.style.opacity = '1'; chatArea.classList.add('visible'); chatInput.disabled = false; chatSendBtn.disabled = false; chatInput.placeholder = "Nhập tin nhắn..."; } }
function setupGuestUI() {
    console.log("Setting up Guest UI");
    localUser = { userId: null, username: "Khách", points: GUEST_INITIAL_POINTS, avatarClass: 'fas fa-user-ninja', isGuest: true, isVerified: false, isSuperVerified: false, isDev: false };
    // Don't call UI updates here, let the caller (onAuthStateChanged/handlePlayGuest) call updateUIAfterAuthChange
}
function updateHeaderDisplay() { if (localUser.isGuest) { showElement(loggedOutView); hideElement(loggedInView); if(logoutBtn) logoutBtn.style.display = 'none'; } else { hideElement(loggedOutView); showElement(loggedInView); if(logoutBtn) logoutBtn.style.display = 'inline-block'; if(currentUsernameEl) currentUsernameEl.textContent = localUser.username; if(currentUserAvatarEl) currentUserAvatarEl.className = (localUser.avatarClass || 'fas fa-user-circle') + ' avatar'; } }
function updatePointsDisplay() { if (userPointsEl) userPointsEl.textContent = localUser.points.toLocaleString(); if (localUser.points <= 0 && isGameInitialized && gameStatus !== "GAMEOVER" && gameOverMessageEl?.style.display !== 'flex' && !localUser.isGuest /* Guests dont go bankrupt */) { gameOver(); } else if (localUser.points > 0 && gameOverMessageEl?.style.display === 'flex') { hideElement(gameOverMessageEl); } updateBettingUIAccess(); }
function updateBettingUIAccess() { const canBet = localUser.points > 0 && isBettingAllowed; if(betAmountInput) betAmountInput.disabled = !canBet; if(betTaiButton) betTaiButton.disabled = !canBet; if(betXiuButton) betXiuButton.disabled = !canBet; if(cancelBetBtn) cancelBetBtn.disabled = !(currentBetState.confirmed && isBettingAllowed); // Enable cancel only if bet confirmed & betting allowed
 if(skipCountdownBtn) skipCountdownBtn.disabled = !(localUser.isDev && isBettingAllowed); updateDevToolsVisibility(); }
function updateVerificationStatusUI() { if (!sendVerificationBtn || !verificationStatusMessageEl) return; clearInterval(verificationCooldownTimer); verificationCooldownTimer = null; if (localUser.isGuest) { hideElement(sendVerificationBtn); verificationStatusMessageEl.textContent = ''; verificationStatusMessageEl.style.display = 'none'; } else { verificationStatusMessageEl.style.display = 'block'; if (localUser.isVerified) { hideElement(sendVerificationBtn); verificationStatusMessageEl.textContent = '✅ Email đã được xác thực'; verificationStatusMessageEl.style.color = 'var(--success-color)'; } else { showElement(sendVerificationBtn); verificationStatusMessageEl.textContent = '⚠️ Email chưa được xác thực'; verificationStatusMessageEl.style.color = 'var(--error-color)'; const now = Date.now(); const timeRemaining = lastVerificationRequestTime + VERIFICATION_COOLDOWN_MS - now; if (timeRemaining > 0) { sendVerificationBtn.disabled = true; const updateCooldownText = () => { const currentNow = Date.now(); const remaining = lastVerificationRequestTime + VERIFICATION_COOLDOWN_MS - currentNow; if (remaining <= 0) { clearInterval(verificationCooldownTimer); verificationCooldownTimer = null; if (!localUser.isVerified) { sendVerificationBtn.disabled = false; sendVerificationBtn.textContent = 'Gửi lại Email Xác Thực'; } } else { const minutes = Math.floor(remaining / 60000); const seconds = Math.floor((remaining % 60000) / 1000); sendVerificationBtn.textContent = `Chờ ${minutes}:${seconds.toString().padStart(2, '0')}`; } }; updateCooldownText(); verificationCooldownTimer = setInterval(updateCooldownText, 1000); } else { sendVerificationBtn.disabled = false; sendVerificationBtn.textContent = 'Gửi lại Email Xác Thực'; } } } }
function handleUserUpdate(data) {
    console.log("Received userUpdate:", data);
    let wasGuest = localUser.isGuest;
    let changed = false;
    let previousVerification = localUser.isVerified;
    let previousSuperVerification = localUser.isSuperVerified;

    // Detect changes
    if (data.userId !== undefined && localUser.userId !== data.userId) { localUser.userId = data.userId; changed = true; }
    if (data.username !== undefined && localUser.username !== data.username) { localUser.username = data.username; changed = true; }
    if (data.points !== undefined && localUser.points !== data.points) { localUser.points = data.points; changed = true; }
    if (data.avatarClass !== undefined && localUser.avatarClass !== data.avatarClass) { localUser.avatarClass = data.avatarClass; changed = true; }
    if (data.isGuest !== undefined && localUser.isGuest !== data.isGuest) { localUser.isGuest = data.isGuest; changed = true; }
    if (data.isVerified !== undefined && localUser.isVerified !== data.isVerified) { localUser.isVerified = data.isVerified; changed = true; }
    if (data.isSuperVerified !== undefined && localUser.isSuperVerified !== data.isSuperVerified) { localUser.isSuperVerified = data.isSuperVerified; changed = true; }
    // Add isDev check if server sends it
    if (data.isDev !== undefined && localUser.isDev !== data.isDev) { localUser.isDev = data.isDev; changed = true; }


    let isNowLoggedIn = !localUser.isGuest;
    let justLoggedIn = wasGuest && isNowLoggedIn;

    if (changed) {
        console.log("User data changed via userUpdate.");
        console.log("New localUser state:", JSON.stringify(localUser));
        if (isNowLoggedIn) {
             console.log("Calling updateUIAfterAuthChange from handleUserUpdate because user is logged in and data changed.");
             updateUIAfterAuthChange(); 
        } else {
             updateHeaderDisplay();
             updatePointsDisplay();
        }

        checkAndShowCongrats(); // Always check congrats
        updateDevToolsVisibility(); // Always update dev tools visibility

    }
    console.log("handleUserUpdate finished. Final localUser:", JSON.stringify(localUser));
    console.log("Logged in view display:", loggedInView?.style.display);
    console.log("Logged out view display:", loggedOutView?.style.display);
    console.log("Chat area display:", chatArea?.style.display);
}

// --- Game Logic Functions ---
async function handleBet(choice) {
    if (!isBettingAllowed) { showTemporaryMessage(currentBetMessageEl, "Hết thời gian đặt cược!", 'loss'); return; }
    const betAmountStr = betAmountInput.value; const betAmount = parseInt(betAmountStr);
    if (isNaN(betAmount) || betAmount <= 0) { showTemporaryMessage(currentBetMessageEl, "Nhập điểm cược hợp lệ!", 'loss'); betAmountInput.value = ''; return; }
    if (betAmount > localUser.points) { showTemporaryMessage(currentBetMessageEl, "Không đủ điểm!", 'loss'); return; }
    const idToken = await getIdToken(); if (!idToken) return;
    showTemporaryMessage(currentBetMessageEl, `Đang gửi lệnh cược ${choice}...`, 'info');
    betAmountInput.disabled = true; // Disable input while processing
    betTaiButton.disabled = true;
    betXiuButton.disabled = true;
    socket.emit('placeBet', { choice: choice, amount: betAmount, token: idToken });
    betAmountInput.value = '';
}
async function handleCancelBet() {
    if (!isBettingAllowed) { showTemporaryMessage(currentBetMessageEl, "Đã hết thời gian hủy cược.", 'loss'); return; }
    if (!currentBetState.confirmed) { showTemporaryMessage(currentBetMessageEl, "Bạn chưa đặt cược để hủy.", 'info'); return; }
    const idToken = await getIdToken(); if (!idToken) return;
    showTemporaryMessage(currentBetMessageEl, "Đang gửi lệnh hủy cược...", 'info');
    cancelBetBtn.disabled = true; // Disable while processing
    socket.emit('cancelBet', { token: idToken });
}

// --- Chat Functions ---
async function sendMessage() {
    if (!chatInput || !chatSendBtn || localUser.isGuest || !localUser.isVerified) { showTemporaryMessage(resultMessageEl, localUser.isGuest ? "Đăng nhập để chat" : "Xác thực email để chat", 'loss'); return; }
    const messageText = chatInput.value.trim();
    if (messageText === '' || messageText.length > 200) { showTemporaryMessage(resultMessageEl, messageText === '' ? "Nhập tin nhắn" : "Tin nhắn quá dài (tối đa 200)", 'loss'); return; }
    const idToken = await getIdToken(); if (!idToken) return;
    chatInput.disabled = true; chatSendBtn.disabled = true;
    socket.emit('sendMessage', { messageText: messageText, token: idToken });
    chatInput.value = '';
    // Re-enable after a short delay to prevent spam, handled by server response mostly now
     setTimeout(() => { if (!localUser.isGuest && localUser.isVerified) { chatInput.disabled = false; chatSendBtn.disabled = false; chatInput.focus(); } }, 500);
}

function displayMessage(messageData) {
    if (!chatMessages || !messageData || !messageData.text) return;

    const tolerance = 10; // Pixels tolerance
    const isScrolledToBottom = chatMessages.scrollHeight - chatMessages.clientHeight <= chatMessages.scrollTop + tolerance;

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message');
    msgDiv.dataset.messageId = messageData.id || '';
    if (messageData.senderUid === localUser.userId) {
        msgDiv.classList.add('sent-by-me');
    }
    if (messageData.isSystem) {
        msgDiv.classList.add('system-message');
    }

    const senderInfoDiv = document.createElement('div');
    senderInfoDiv.classList.add('sender-info');

    const avatarEl = document.createElement('i');
    avatarEl.className = (messageData.senderAvatar || 'fas fa-user-circle') + ' sender-avatar';
    senderInfoDiv.appendChild(avatarEl);

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('sender-name');
    nameSpan.textContent = messageData.senderUsername || 'Người chơi';
    senderInfoDiv.appendChild(nameSpan);

    const badgeContainer = document.createElement('span');
    badgeContainer.classList.add('super-verified-badge-container');
    if (messageData.senderIsSuperVerified) {
        const badgeImg = document.createElement('img');
        badgeImg.src = 'superverifed.png';
        badgeImg.alt = 'Verified';
        badgeImg.classList.add('super-verified-badge');
        badgeContainer.appendChild(badgeImg);
    }
    senderInfoDiv.appendChild(badgeContainer);

    if (messageData.timestamp) {
        const timeSpan = document.createElement('span');
        timeSpan.classList.add('message-timestamp');
        const date = new Date(messageData.timestamp);
        timeSpan.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        senderInfoDiv.appendChild(timeSpan);
    }

    const textP = document.createElement('p');
    textP.classList.add('message-text');
    textP.textContent = messageData.text; // Use textContent to prevent XSS

    msgDiv.appendChild(senderInfoDiv);
    msgDiv.appendChild(textP);
    chatMessages.appendChild(msgDiv);

    if (isScrolledToBottom || messageData.senderUid === localUser.userId) {
        scrollToBottom(chatMessages);
        if (newMessagesIndicator) newMessagesIndicator.style.display = 'none';
    } else {
        if (newMessagesIndicator) newMessagesIndicator.style.display = 'block';
    }
}

function displayMessageHistory(messages) {
    if (!chatMessages) return;
    chatMessages.innerHTML = '';
    if (newMessagesIndicator) newMessagesIndicator.style.display = 'none';
    if (!messages || messages.length === 0) {
        return;
    }
    messages.forEach(msg => displayMessage(msg));
    scrollToBottom(chatMessages); // Scroll to bottom after loading history
}
function scrollToBottom(element) { if (element) { element.scrollTop = element.scrollHeight; } }

// --- Congrats Popup ---
function showCongratsPopup(userId) { if (localUser.isGuest || localUser.points < CONGRATS_THRESHOLD || !userId) return; console.log("Showing congratulations popup for UID:", userId); if(congratsUidEl) congratsUidEl.textContent = userId; // Username might not be needed if UID is primary identifier
 //if(congratsUsernameEl) congratsUsernameEl.textContent = localUser.username || "Người chơi";
 if(congratsModalWrapper) showModal(congratsModalWrapper); }
function hideCongratsPopup() { if(congratsModalWrapper) hideModal(congratsModalWrapper); }
function checkAndShowCongrats() { if (!localUser.isGuest && localUser.points >= CONGRATS_THRESHOLD && !hasShownCongratsPopup) { console.log("Congrats condition met! Showing popup."); showCongratsPopup(localUser.userId); hasShownCongratsPopup = true; } else if (localUser.points < CONGRATS_THRESHOLD) { if (hasShownCongratsPopup) { console.log("Points dropped below threshold, resetting congrats flag."); } hasShownCongratsPopup = false; } else if (!localUser.isGuest && localUser.points >= CONGRATS_THRESHOLD && hasShownCongratsPopup) { console.log("Congrats condition met, but popup already shown this session."); } }

// --- Music Functions ---
function toggleMusic() { isMuted = !isMuted; audioPlayer.muted = isMuted; localStorage.setItem('txMuted', isMuted); updateMusicButtonIcon(); console.log("Music muted:", isMuted); if (!isMuted && currentServerSongPath && audioPlayer.paused && hasMusicStarted /* Only play if music system started */) { audioPlayer.play().catch(e => console.error("[Music] Error playing on unmute:", e)); } else if (isMuted && !audioPlayer.paused) { audioPlayer.pause(); } }
function updateMusicButtonIcon() { if (!toggleMusicBtn) return; const icon = toggleMusicBtn.querySelector('i'); if (!icon) return; if (isMuted) { icon.className = 'fas fa-volume-mute'; toggleMusicBtn.title = 'Bật nhạc'; toggleMusicBtn.classList.add('muted'); } else { icon.className = 'fas fa-volume-up'; toggleMusicBtn.title = 'Tắt nhạc'; toggleMusicBtn.classList.remove('muted'); } }

// --- History Functions ---
function addHistoryEntry(resultData) { const existingIndex = gameHistory.findIndex(h => h.sessionId === resultData.sessionId); const historyEntry = { sessionId: resultData.sessionId, dice: resultData.dice, sum: resultData.sum, outcome: resultData.outcome, playerBetChoice: resultData.playerBetChoice, playerBetAmount: resultData.playerBetAmount, pointChange: resultData.pointChange, isTriple: resultData.outcome.toLowerCase().includes('bộ ba') }; if (existingIndex > -1) { gameHistory[existingIndex] = historyEntry; } else { gameHistory.unshift(historyEntry); } if (gameHistory.length > MAX_LOCAL_HISTORY) { gameHistory.length = MAX_LOCAL_HISTORY; } updateSimpleHistoryDisplay(); }
function updateSimpleHistoryDisplay() { if (!historyRowEl) return; const label = historyRowEl.querySelector('span'); historyRowEl.innerHTML = ''; if (label) historyRowEl.appendChild(label); const displayLimit = MAX_SIMPLE_HISTORY; let displayedCount = 0; // Use gameHistory which includes player bet info
 for (const entry of gameHistory) { // Iterate through locally stored history
    if (entry.playerBetAmount > 0) { // Only show markers for sessions the player bet in
        const marker = document.createElement('div');
        marker.classList.add('history-marker');
        if (entry.pointChange > 0) {
            marker.classList.add('win');
        } else if (entry.pointChange < 0) {
            marker.classList.add('loss');
        } else {
             // Could add a 'tie' class if needed, or leave neutral
        }
        let betString = `${entry.playerBetChoice} ${entry.playerBetAmount.toLocaleString()}`;
        marker.title = `Phiên #${entry.sessionId}: ${entry.outcome} (${entry.sum}) | Cược: ${betString} | KQ: ${entry.pointChange >= 0 ? '+' : ''}${entry.pointChange.toLocaleString()}`;
        historyRowEl.insertBefore(marker, historyRowEl.children[1]); // Insert after label
        displayedCount++;
        if (displayedCount >= displayLimit) { break; }
    }
 }
 if (displayedCount === 0 && label) { const noBetHistoryMsg = document.createElement('span'); noBetHistoryMsg.textContent = ' (Chưa có phiên cược nào)'; noBetHistoryMsg.style.fontSize = '0.8em'; noBetHistoryMsg.style.color = '#888'; historyRowEl.appendChild(noBetHistoryMsg); } }
function renderDetailedHistoryPanel() {
    if (!historyListEl) return; historyListEl.innerHTML = ''; const combinedHistory = []; const includedSessionIds = new Set();
    // Prioritize local history (which has bet details)
    gameHistory.forEach(localEntry => { if (combinedHistory.length < MAX_DETAILED_HISTORY_DISPLAY && !includedSessionIds.has(localEntry.sessionId)) { combinedHistory.push({ ...localEntry, type: 'local' }); includedSessionIds.add(localEntry.sessionId); } });
    // Fill remaining slots with server history (for sessions without local bets)
    serverHistoryCache.forEach(serverEntry => { if (combinedHistory.length < MAX_DETAILED_HISTORY_DISPLAY && !includedSessionIds.has(serverEntry.sessionId)) { combinedHistory.push({ ...serverEntry, type: 'server' }); includedSessionIds.add(serverEntry.sessionId); } });
    combinedHistory.sort((a, b) => b.sessionId - a.sessionId); combinedHistory.length = Math.min(combinedHistory.length, MAX_DETAILED_HISTORY_DISPLAY);
    if (combinedHistory.length === 0) { historyListEl.innerHTML = '<li>Chưa có lịch sử.</li>'; return; }
    combinedHistory.forEach(entry => {
        const li = document.createElement('li'); const line1 = document.createElement('div'); line1.classList.add('history-line-1'); const sessionDiceSumSpan = document.createElement('span'); sessionDiceSumSpan.textContent = `Phiên #${entry.sessionId} [${entry.dice.join('-')}] (${entry.sum})`; const outcomeSpan = document.createElement('span'); outcomeSpan.textContent = entry.outcome; if (entry.isTriple || entry.outcome?.toLowerCase().includes('bộ ba')) { outcomeSpan.classList.add('history-outcome-triple'); outcomeSpan.style.fontWeight = 'bold'; } else { outcomeSpan.classList.add(entry.outcome === 'Tài' ? 'history-outcome-tai' : 'history-outcome-xiu'); } line1.appendChild(sessionDiceSumSpan); line1.appendChild(outcomeSpan); li.appendChild(line1);
        const lineBet = document.createElement('div'); lineBet.classList.add('history-line-2'); const playerBetSpan = document.createElement('span'); playerBetSpan.classList.add('history-player-bet'); // Add class
        const pointChangeSpan = document.createElement('span'); pointChangeSpan.classList.add('history-result');
        // Check if it's a local entry AND a bet was made
        if (entry.type === 'local' && entry.playerBetAmount > 0) { playerBetSpan.textContent = `Cược ${entry.playerBetChoice}: ${entry.playerBetAmount.toLocaleString()}`; pointChangeSpan.textContent = `${entry.pointChange >= 0 ? '+' : ''}${entry.pointChange.toLocaleString()}`; if (entry.pointChange > 0) { pointChangeSpan.classList.add('win'); } else if (entry.pointChange < 0) { pointChangeSpan.classList.add('loss'); } else { pointChangeSpan.classList.add('no-bet'); /* Tie or no change */ } }
        else { playerBetSpan.textContent = `Không cược`; pointChangeSpan.textContent = `0`; pointChangeSpan.classList.add('no-bet'); }
        lineBet.appendChild(playerBetSpan); lineBet.appendChild(pointChangeSpan); li.appendChild(lineBet); historyListEl.appendChild(li);
    });
}
function toggleDetailedHistory() { if (!historyPanelWrapperEl) return; if (localUser.isGuest) { alert("Vui lòng đăng nhập để xem lịch sử chi tiết."); return; } // Allow even if not verified, but maybe show less info? Or keep verification check.
 // if (localUser.isGuest || !localUser.isVerified) { alert("Vui lòng đăng nhập và xác thực email để xem lịch sử chi tiết."); return; }
 const isHidden = historyPanelWrapperEl.style.display === 'none' || historyPanelWrapperEl.style.display === ''; if (isHidden) { renderDetailedHistoryPanel(); } historyPanelWrapperEl.style.display = isHidden ? 'flex' : 'none'; historyPanelWrapperEl.classList.toggle('show', isHidden); }


// --- Modal Functions ---
function toggleInfoModal() { if(infoModalWrapperEl) { const isHidden = infoModalWrapperEl.style.display === 'none' || infoModalWrapperEl.style.display === ''; infoModalWrapperEl.style.display = isHidden ? 'flex' : 'none'; infoModalWrapperEl.classList.toggle('show', isHidden); } }
function toggleSettingsModal() { if (!settingsModalWrapperEl) return; const isHidden = settingsModalWrapperEl.style.display === 'none' || settingsModalWrapperEl.style.display === ''; settingsModalWrapperEl.style.display = isHidden ? 'flex' : 'none'; settingsModalWrapperEl.classList.toggle('show', isHidden); if (isHidden) { if(newUsernameInput) newUsernameInput.value = localUser.username; if(avatarSelectionContainer) { const currentAvatar = localUser.avatarClass || (localUser.isGuest ? 'fas fa-user-ninja' : 'fas fa-user-circle'); const options = avatarSelectionContainer.querySelectorAll('.avatar-option'); options.forEach(opt => opt.classList.toggle('selected', opt.dataset.avatar === currentAvatar)); } if(sessionDurationInput) sessionDurationInput.value = ''; if(devPasswordInput) devPasswordInput.value = ''; updateDevToolsVisibility(); if(devSetPointsInput) devSetPointsInput.value = ''; updateVerificationStatusUI(); } }
async function saveSettings() {
    if (!newUsernameInput || !avatarSelectionContainer) return;
    const newUsername = newUsernameInput.value.trim(); const selectedAvatarOption = avatarSelectionContainer.querySelector('.avatar-option.selected'); const newAvatarClass = selectedAvatarOption ? selectedAvatarOption.dataset.avatar : (localUser.isGuest ? 'fas fa-user-ninja' : 'fas fa-user-circle');
    if (!newUsername || newUsername.length > 15) { alert("Tên không hợp lệ (1-15 ký tự)."); return; }
    if (localUser.isGuest) { localStorage.setItem('txGuestUsername', newUsername); localStorage.setItem('txGuestAvatarClass', newAvatarClass); localUser.username = newUsername; localUser.avatarClass = newAvatarClass; updateHeaderDisplay(); alert("Cài đặt khách đã lưu (chỉ hiển thị)."); toggleSettingsModal(); }
    else { const idToken = await getIdToken(); if (!idToken) return; socket.emit('saveProfileSettings', { username: newUsername, avatarClass: newAvatarClass, token: idToken }); toggleSettingsModal(); }
}
function handleAvatarSelection(event) { const clickedOption = event.target.closest('.avatar-option'); if (!clickedOption || !avatarSelectionContainer) return; const allOptions = avatarSelectionContainer.querySelectorAll('.avatar-option'); allOptions.forEach(opt => opt.classList.remove('selected')); clickedOption.classList.add('selected'); }

// --- Transfer Points Modal ---
function openTransferModal() {
    if (localUser.isGuest) return; // Should not happen as button is hidden, but double-check

    // Reset modal state
    if(myUidDisplay) myUidDisplay.textContent = localUser.userId || 'N/A';
    if(recipientUidInput) recipientUidInput.value = '';
    if(transferAmountInput) transferAmountInput.value = '';
    if(transferErrorMsg) { transferErrorMsg.textContent = ''; transferErrorMsg.className = 'error-message'; transferErrorMsg.style.display = 'none';}
    if(copyStatusMsg) { copyStatusMsg.textContent = ''; copyStatusMsg.className = 'info-message small-info'; copyStatusMsg.style.display = 'none'; }
    if(confirmTransferBtn) confirmTransferBtn.disabled = false;

    updateTransferModalState(); // Update visibility of sections based on current user state
    showModal(transferModalWrapper);
}

function closeTransferModal() {
    hideModal(transferModalWrapper);
}

// Updates the visibility of send/not-allowed sections inside the transfer modal
function updateTransferModalState() {
    // Only update if the modal is actually visible to avoid unnecessary checks
    if (!transferModalWrapper || transferModalWrapper.style.display === 'none') {
        return;
    }

    // Update UID display just in case it changed while modal was open (unlikely but safe)
    if(myUidDisplay) myUidDisplay.textContent = localUser.userId || 'N/A';

    // Check eligibility to SEND points
    const canTransfer = !localUser.isGuest && localUser.isVerified && localUser.isSuperVerified;

    if (canTransfer) {
        showElement(sendPointsSection);
        hideElement(transferNotAllowedMsg);
    } else {
        hideElement(sendPointsSection);
        showElement(transferNotAllowedMsg);
    }
}

async function copyMyUid() {
    if (!localUser.userId || !navigator.clipboard) {
        showTemporaryMessage(copyStatusMsg, 'Không thể sao chép ID.', 'loss', 2000);
        return;
    }
    try {
        await navigator.clipboard.writeText(localUser.userId);
        showTemporaryMessage(copyStatusMsg, 'Đã sao chép ID!', 'win', 2000);
    } catch (err) {
        console.error('Lỗi sao chép UID:', err);
        showTemporaryMessage(copyStatusMsg, 'Lỗi khi sao chép.', 'loss', 2000);
    }
}

async function handleConfirmTransfer() {
    if (!recipientUidInput || !transferAmountInput || !transferErrorMsg || !confirmTransferBtn) return;

    const recipientUid = recipientUidInput.value.trim();
    const amountStr = transferAmountInput.value;
    const amount = parseInt(amountStr);

    // --- Client-Side Validation ---
    transferErrorMsg.textContent = ''; // Clear previous error
    transferErrorMsg.style.display = 'none'; // Hide error initially

    if (!recipientUid) {
        showTemporaryMessage(transferErrorMsg, 'Vui lòng nhập ID người nhận.', 'loss', 3000);
        return;
    }
    if (recipientUid === localUser.userId) {
         showTemporaryMessage(transferErrorMsg, 'Bạn không thể tự chuyển điểm cho chính mình.', 'loss', 3000);
         return;
    }
    if (isNaN(amount) || amount < MIN_TRANSFER_AMOUNT) {
        showTemporaryMessage(transferErrorMsg, `Số điểm chuyển phải là số và tối thiểu là ${MIN_TRANSFER_AMOUNT}.`, 'loss', 3000);
        return;
    }
    if (!localUser.isVerified || !localUser.isSuperVerified) {
        showTemporaryMessage(transferErrorMsg, 'Bạn không đủ điều kiện để chuyển điểm.', 'loss', 3000);
         updateTransferModalState(); // Update UI just in case
        return;
    }
     const requiredPoints = amount + MIN_POINTS_AFTER_TRANSFER;
    if (localUser.points < requiredPoints) {
        showTemporaryMessage(transferErrorMsg, `Không đủ điểm. Bạn cần ít nhất ${requiredPoints.toLocaleString()} điểm để chuyển ${amount.toLocaleString()} (phải còn lại ${MIN_POINTS_AFTER_TRANSFER.toLocaleString()}).`, 'loss', 4000);
        return;
    }
    // --- End Client-Side Validation ---

    const idToken = await getIdToken();
    if (!idToken || !socket || !socket.connected) {
        showTemporaryMessage(transferErrorMsg, 'Lỗi kết nối hoặc xác thực. Vui lòng thử lại.', 'loss', 3000);
        return;
    }

    // Disable button, show processing
    confirmTransferBtn.disabled = true;
    showTemporaryMessage(transferErrorMsg, 'Đang xử lý giao dịch...', 'info', 10000); // Show longer processing message

    socket.emit('requestPointTransfer', {
        recipientUid: recipientUid,
        amount: amount,
        token: idToken
    });
}


// --- Developer Functions ---
async function unlockDeveloperSettings() {
    if (!devPasswordInput || devPasswordInput.value !== DEV_PASSWORD) { alert("Sai mật khẩu!"); return; }
    const idToken = await getIdToken(); if (!idToken) return; // Need token for server check
    if (socket && socket.connected) { socket.emit('requestDevModeStatus', { token: idToken }); }
    // Don't immediately show/hide, wait for server confirmation via devModeStatus event
    alert("Đã nhập mật khẩu. Đang kiểm tra quyền..."); if(devPasswordInput) devPasswordInput.value = '';
}
function updateDevToolsVisibility() { const showDev = localUser.isDev; if (settingsModalWrapperEl?.style.display === 'flex') { if (showDev) { if(devPasswordSection) hideElement(devPasswordSection); if(developerSettingsArea) showElement(developerSettingsArea); } else { if(devPasswordSection) showElement(devPasswordSection); if(developerSettingsArea) hideElement(developerSettingsArea); } } if(skipCountdownBtn) { if (showDev && isBettingAllowed) showElement(skipCountdownBtn); else hideElement(skipCountdownBtn); } }
async function devSetPoints() {
    if (!localUser.isDev) { alert("Chức năng nhà phát triển chưa được kích hoạt."); return; } if (!devSetPointsInput) return; const newPointsStr = devSetPointsInput.value; const newPoints = parseInt(newPointsStr); if (isNaN(newPoints) || newPoints < 0) { alert("Vui lòng nhập số điểm hợp lệ (số không âm)."); devSetPointsInput.value = ''; return; }
    const idToken = await getIdToken(); if (!idToken) return;
    socket.emit('requestDevSetPoints', { amount: newPoints, token: idToken });
    devSetPointsInput.value = '';
}
async function skipCountdown() {
    if (!localUser.isDev || !isBettingAllowed) return;
    const idToken = await getIdToken(); if (!idToken) return;
    socket.emit('requestSkipCountdown', { token: idToken });
}
async function devSkipSong() {
    if (!localUser.isDev || !socket || !socket.connected) return;
    const idToken = await getIdToken(); if (!idToken) return;
    socket.emit('requestSkipSong', { token: idToken });
}
async function devPlaySelectedSong() {
    if (!localUser.isDev || !socket || !socket.connected || !devSongSelect) return; const selectedSong = devSongSelect.value; if (!selectedSong) { alert("Vui lòng chọn một bài hát."); return; }
    const idToken = await getIdToken(); if (!idToken) return;
    socket.emit('requestPlaySpecificSong', { songPath: selectedSong, token: idToken });
}

// --- Result Cover Drag ---
function startDrag(e) { if (gameStatus !== "REVEALING" || hasRevealedLocally || !resultCoverEl) return; isDraggingCover = true; resultCoverEl.classList.add('dragging'); const rect = resultCoverEl.getBoundingClientRect(); let startClientX, startClientY; if (e.type === 'touchstart') { startClientX = e.touches[0].clientX; startClientY = e.touches[0].clientY; } else { startClientX = e.clientX; startClientY = e.clientY; e.preventDefault(); } coverOffsetX = startClientX - rect.left; coverOffsetY = startClientY - rect.top; coverStartX = startClientX; coverStartY = startClientY; document.addEventListener('mousemove', dragCover); document.addEventListener('mouseup', endDrag); document.addEventListener('touchmove', dragCover, { passive: false }); document.addEventListener('touchend', endDrag); }
function dragCover(e) { if (!isDraggingCover || hasRevealedLocally || !centerDisplayEl || !resultCoverEl) return; let currentClientX, currentClientY; if (e.type === 'touchmove') { currentClientX = e.touches[0].clientX; currentClientY = e.touches[0].clientY; e.preventDefault(); } else { currentClientX = e.clientX; currentClientY = e.clientY; } const parentRect = centerDisplayEl.getBoundingClientRect(); let newX = currentClientX - parentRect.left - coverOffsetX; let newY = currentClientY - parentRect.top - coverOffsetY; resultCoverEl.style.transform = `translate(${newX}px, ${newY}px)`; const dragDistance = Math.sqrt(Math.pow(currentClientX - coverStartX, 2) + Math.pow(currentClientY - coverStartY, 2)); const revealThreshold = 60; if (dragDistance > revealThreshold) { revealResultsFromCoverDrag(); } }
function endDrag() { if (!isDraggingCover || !resultCoverEl) return; isDraggingCover = false; resultCoverEl.classList.remove('dragging'); document.removeEventListener('mousemove', dragCover); document.removeEventListener('mouseup', endDrag); document.removeEventListener('touchmove', dragCover); document.removeEventListener('touchend', endDrag); if (!hasRevealedLocally) { resultCoverEl.style.transition = 'transform 0.3s ease'; resultCoverEl.style.transform = `translate(0px, 0px)`; setTimeout(() => { resultCoverEl.style.transition = ''; }, 300); } }
function revealResultsFromCoverDrag() { if (!hasRevealedLocally && gameStatus === "REVEALING" && resultCoverEl && resultAreaEl) { hasRevealedLocally = true; hideElement(resultCoverEl); resultCoverEl.style.transform = `translate(0px, 0px)`; resultAreaEl.style.visibility = 'visible'; console.log("Revealed locally via drag."); } }

// --- Game Over & Restart ---
function gameOver() {
    if (!gameOverMessageEl) return;
    gameStatus = "GAMEOVER"; clearInterval(localTimerInterval); clearInterval(waitInterval); disableBettingUI();
    if(resultCoverEl) hideElement(resultCoverEl); if(resultAreaEl) resultAreaEl.style.visibility = 'hidden';
    showElement(gameOverMessageEl);
    if(sessionStatusEl) sessionStatusEl.textContent = "Game Over"; if(timerLabelEl) timerLabelEl.textContent = "Kết thúc"; if(timerEl) timerEl.textContent = "💔"; if(timerAreaEl) showElement(timerAreaEl);
}
async function restartGame() {
    if (localUser.isGuest) { window.location.reload(); }
    else { const idToken = await getIdToken(); if (!idToken) return; if (socket && socket.connected) { socket.emit('requestRestartPoints', { token: idToken }); if(gameOverMessageEl) hideElement(gameOverMessageEl); if(sessionStatusEl) sessionStatusEl.textContent = "Đang chờ phiên mới..."; resetBetState(); } else { alert("Mất kết nối tới server."); } }
}
function disableBettingUI() { isBettingAllowed = false; updateBettingUIAccess(); }
function resetBetState() { currentBetState = { choice: null, amount: 0, confirmed: false }; if(currentBetMessageEl) { currentBetMessageEl.textContent = ''; currentBetMessageEl.className = ''; currentBetMessageEl.style.display = 'none'; } if(cancelBetBtn) cancelBetBtn.disabled = true; }

// --- Socket.IO Setup & Listeners ---
function setupSocketListeners() {
    // Re-check SERVER_URL here in case it was missed by initial check (unlikely)
    if (!SERVER_URL || SERVER_URL.startsWith("__")) { console.error("Chưa cấu hình SERVER_URL!"); alert("Lỗi cấu hình kết nối."); if(sessionStatusEl) sessionStatusEl.textContent = "Lỗi cấu hình!"; return; } if (typeof io === 'undefined') { console.error("Socket.IO client not loaded!"); alert("Lỗi tải thư viện kết nối."); if(sessionStatusEl) sessionStatusEl.textContent = "Lỗi tải thư viện!"; return; } console.log("Setting up Socket.IO connection to:", SERVER_URL); if(socket && socket.connected) { socket.disconnect(); } socket = io(SERVER_URL, { reconnection: true, reconnectionAttempts: 5, reconnectionDelay: 1000, transports: ['websocket', 'polling'] });

    socket.on("connect", async () => { console.log("Connected to server:", socket.id); if(sessionStatusEl) sessionStatusEl.textContent = "Đã kết nối!"; gameStatus = "CONNECTED"; if (auth.currentUser && !localUser.isGuest) { // Send token only if logged in (not guest)
        const idToken = await getIdToken(); if(idToken) { socket.emit('userLoggedIn', { token: idToken }); } } });

    socket.on('initialServerHistory', (historyData) => { console.log(`Received initialServerHistory with ${historyData.length} records.`); if (Array.isArray(historyData)) { serverHistoryCache = historyData; if (historyPanelWrapperEl?.style.display === 'flex') { renderDetailedHistoryPanel(); } } else { console.error("Invalid initial history data received."); serverHistoryCache = []; } });
    socket.on('historyError', (message) => { console.error("History Error from server:", message); if (historyPanelWrapperEl?.style.display === 'flex' && historyListEl) { historyListEl.innerHTML = `<li style="color: var(--error-color); text-align: center;">${message}</li>`; } if (message.includes("Lỗi tải lịch sử ban đầu")) { alert(`Lỗi tải lịch sử: ${message}`); } });
    socket.on('leaderboardUpdate', (topPlayers) => {
        if (!leaderboardList) return;
        leaderboardList.innerHTML = '';
        if (!topPlayers || topPlayers.length === 0) { leaderboardList.innerHTML = '<li>Chưa có dữ liệu xếp hạng.</li>'; return; }
        const displayLimit = 5;
        topPlayers.slice(0, displayLimit).forEach((player, index) => {
            const li = document.createElement('li');
            const rankSpan = document.createElement('span'); rankSpan.className = 'leaderboard-rank'; rankSpan.textContent = `${index + 1}.`; li.appendChild(rankSpan);
            const nameSpan = document.createElement('span'); nameSpan.className = 'leaderboard-name'; nameSpan.textContent = player.username || 'Người chơi ẩn'; nameSpan.title = player.username || 'Người chơi ẩn'; li.appendChild(nameSpan);
            const badgeContainer = document.createElement('span'); badgeContainer.classList.add('super-verified-badge-container'); if (player.isSuperVerified) { const badgeImg = document.createElement('img'); badgeImg.src = 'superverifed.png'; badgeImg.alt = 'Verified'; badgeImg.classList.add('super-verified-badge'); badgeContainer.appendChild(badgeImg); } li.appendChild(badgeContainer);
            const pointsSpan = document.createElement('span'); pointsSpan.className = 'leaderboard-points'; pointsSpan.textContent = (player.points !== undefined && player.points !== null) ? player.points.toLocaleString() : 'N/A'; li.appendChild(pointsSpan);
            leaderboardList.appendChild(li);
        });
    });
    socket.on("disconnect", (reason) => { console.log("Disconnected from server:", reason); if(sessionStatusEl) sessionStatusEl.textContent = "Mất kết nối..."; gameStatus = "DISCONNECTED"; disableBettingUI(); clearInterval(localTimerInterval); clearInterval(waitInterval); audioPlayer.pause(); currentServerSongPath = null; hasMusicStarted = false; });
    socket.on("connect_error", (error) => { console.error("Connection Error:", error); if(sessionStatusEl) sessionStatusEl.textContent = "Lỗi kết nối server!"; gameStatus = "ERROR"; disableBettingUI(); clearInterval(localTimerInterval); clearInterval(waitInterval); });
    socket.on('restartSuccess', (data) => { console.log('Server confirmed point restart. New points:', data.newPoints); // Server should send userUpdate instead or as well
    });
    socket.on('restartError', (message) => { console.error('Server error during point restart:', message); alert(`Lỗi khi vay điểm: ${message}`); });
    socket.on("gameStateUpdate", (state) => { updateUIFromState(state); });
    socket.on("userUpdate", (data) => { handleUserUpdate(data); });
    socket.on("betPlaced", (data) => { console.log("Server confirmed bet:", data); currentBetState.choice = data.choice; currentBetState.amount = data.amount; currentBetState.confirmed = true; showTemporaryMessage(currentBetMessageEl, `Đã cược: ${data.choice} (${data.amount.toLocaleString()})`, 'win'); updateBettingUIAccess(); cancelBetBtn.disabled = false; // Enable cancel after bet placed
        betAmountInput.disabled = false; // Re-enable input
        betTaiButton.disabled = false;
        betXiuButton.disabled = false;
     });
    socket.on("betCancelled", () => { console.log("Server confirmed bet cancellation."); resetBetState(); showTemporaryMessage(currentBetMessageEl, "Đã hủy cược.", 'info'); updateBettingUIAccess(); cancelBetBtn.disabled = true; // Disable cancel after successful cancel
        betAmountInput.disabled = false; // Re-enable input
        betTaiButton.disabled = false;
        betXiuButton.disabled = false;
     });
    socket.on("betError", (message) => { console.error("Bet Error from server:", message); showTemporaryMessage(currentBetMessageEl, message, 'loss'); betAmountInput.disabled = false; // Re-enable on error
        betTaiButton.disabled = false;
        betXiuButton.disabled = false;
        cancelBetBtn.disabled = true; // Ensure cancel is disabled on error
        if (isBettingAllowed) { updateBettingUIAccess(); } });
    socket.on("betResult", (data) => { console.log("Received betResult:", data); localUser.points = data.newPoints; updatePointsDisplay(); checkAndShowCongrats(); let msg = `Phiên #${data.sessionId}: ${data.outcome} (${data.sum}). `; if (data.pointChange > 0) { msg += `Thắng +${data.pointChange.toLocaleString()}`; showTemporaryMessage(resultMessageEl, msg, 'win', 5000); } else if (data.pointChange < 0) { msg += `Thua ${data.pointChange.toLocaleString()}`; showTemporaryMessage(resultMessageEl, msg, 'loss', 5000); } else { msg += `Không thắng/thua.`; showTemporaryMessage(resultMessageEl, msg, 'no-bet', 5000); } addHistoryEntry({ ...data, playerBetChoice: currentBetState.choice, playerBetAmount: currentBetState.amount }); resetBetState(); });
    socket.on('profileUpdateSuccess', (data) => { console.log("Profile update successful:", data); // Server should send a full userUpdate event instead
        /* // Update handled by userUpdate event now
        if (data.username) localUser.username = data.username;
        if (data.avatarClass) localUser.avatarClass = data.avatarClass;
        updateHeaderDisplay();
        */
        alert("Cập nhật thông tin thành công!"); });
    socket.on('profileError', (message) => { console.error("Profile Error from server:", message); alert(`Lỗi cập nhật thông tin: ${message}`); });
    socket.on('devModeStatus', (data) => { console.log("Received devModeStatus:", data.isDev); localUser.isDev = data.isDev; updateDevToolsVisibility(); if (data.isDev && settingsModalWrapperEl?.style.display === 'flex') { alert("Quyền nhà phát triển đã được xác nhận!"); } else if (!data.isDev && settingsModalWrapperEl?.style.display === 'flex') { alert("Bạn không có quyền nhà phát triển."); hideElement(developerSettingsArea); showElement(devPasswordSection); } });
    socket.on('devSuccess', (message) => { console.log("Dev Success:", message); alert(message); });
    socket.on('devError', (message) => { console.error("Dev Error from server:", message); alert(`Lỗi Developer: ${message}`); });
    socket.on("serverError", (message) => { console.error("Server Error:", message); if(sessionStatusEl) showTemporaryMessage(sessionStatusEl, `Lỗi Server: ${message}`, 'loss', 5000); });
    socket.on('chatHistory', (messages) => { console.log(`Received chat history with ${messages.length} messages.`); displayMessageHistory(messages); updateChatVisibility(); });
    socket.on('chatMessage', (messageData) => { console.log("Received new chat message:", messageData); displayMessage(messageData); });
    socket.on('chatError', (errorMessage) => { console.error("Chat Error from server:", errorMessage); showTemporaryMessage(resultMessageEl, errorMessage, 'loss', 4000); if (!localUser.isGuest && localUser.isVerified && chatInput && chatInput.disabled) { chatInput.disabled = false; chatSendBtn.disabled = false; } });
    socket.on('promptClientVerification', (data) => { console.log("Server prompted client to send verification email for:", data?.email); if (auth.currentUser) { auth.currentUser.sendEmailVerification().then(() => { console.log("Verification email sent successfully via client SDK."); alert(`Đã gửi email xác thực tới ${data?.email || 'địa chỉ của bạn'}. Vui lòng kiểm tra hộp thư (cả mục Spam/Quảng cáo).`); lastVerificationRequestTime = Date.now(); updateVerificationStatusUI(); }).catch((error) => { console.error("Error sending verification email via client SDK:", error); let message = "Lỗi gửi email xác thực."; if (error.code === 'auth/too-many-requests') { message = "Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau."; } alert(message); if (sendVerificationBtn) { clearInterval(verificationCooldownTimer); verificationCooldownTimer = null; sendVerificationBtn.disabled = false; sendVerificationBtn.textContent = 'Gửi lại Email Xác Thực'; } }); } else { console.error("Cannot send verification email: No user logged in."); alert("Lỗi: Không tìm thấy người dùng hiện tại để gửi email."); if (sendVerificationBtn) { clearInterval(verificationCooldownTimer); verificationCooldownTimer = null; sendVerificationBtn.disabled = false; sendVerificationBtn.textContent = 'Gửi lại Email Xác Thực'; } } });
    socket.on('verificationError', (message) => { console.error("Verification Error from server:", message); alert(`Lỗi Xác thực: ${message}`); if (sendVerificationBtn) { clearInterval(verificationCooldownTimer); verificationCooldownTimer = null; sendVerificationBtn.disabled = false; sendVerificationBtn.textContent = 'Gửi lại Email Xác Thực'; } });
    socket.on('verificationInfo', (message) => { console.log("Verification Info from server:", message); alert(`Thông tin Xác thực: ${message}`); // Server should send userUpdate event instead
        /* // Update handled by userUpdate event now
        if (message.includes("đã được xác thực") && verificationStatusMessageEl) {
            localUser.isVerified = true;
            updateVerificationStatusUI();
            updateChatVisibility(); // Re-check chat access
            updateTransferModalState(); // Re-check transfer access
        }
        */
     });
    socket.on('musicUpdate', (data) => {
        console.log('[Music] Received update:', data);
        const { songPath, startTime, serverTime } = data;
        if (!songPath || startTime === undefined || serverTime === undefined) { console.warn('[Music] Incomplete music update received.'); return; }
        const clientTimeNow = Date.now(); const serverTimeElapsed = serverTime - startTime; const estimatedOffset = Math.max(0, serverTimeElapsed / 1000.0);
        const isNewSong = !currentServerSongPath || currentServerSongPath !== songPath;
        const needsResync = audioPlayer.src.endsWith(songPath) ? Math.abs(audioPlayer.currentTime - estimatedOffset) > 2.0 : false;
        currentServerSongPath = songPath;
        const playAudio = () => {
            audioPlayer.muted = isMuted; audioLoadPromise = audioPlayer.play();
            if (audioLoadPromise !== undefined) { audioLoadPromise.then(() => { console.log(`[Music] Playback started/resumed for ${songPath}.`); hasMusicStarted = true; }).catch(error => { console.error(`[Music] Play error for ${songPath}:`, error.name, error.message); hasMusicStarted = false; }); }
        };
        if (isNewSong) {
            console.log(`[Music] Changing to ${songPath} at offset ${estimatedOffset.toFixed(2)}s`); audioPlayer.src = songPath;
            const canPlayHandler = () => { console.log(`[Music] 'canplaythrough' received for ${songPath}. Seeking.`); if (estimatedOffset < audioPlayer.duration) { audioPlayer.currentTime = estimatedOffset; console.log(`[Music] Seeked to ${estimatedOffset.toFixed(2)}`); } else { console.warn(`[Music] Offset ${estimatedOffset} >= duration ${audioPlayer.duration}. Starting from 0.`); audioPlayer.currentTime = 0; } if (!isMuted) playAudio(); };
            audioPlayer.addEventListener('canplaythrough', canPlayHandler, { once: true });
            // Fallback timeout in case 'canplaythrough' doesn't fire reliably
            setTimeout(() => { if (audioPlayer.src.endsWith(songPath) && audioPlayer.readyState < 4 && audioPlayer.paused) { console.warn(`[Music] Fallback: 'canplaythrough' not received for ${songPath} in time. Attempting play.`); if (!isMuted) playAudio(); } }, 5000);
            audioPlayer.load(); // Important to start loading the new source
        } else if (needsResync) {
            console.log(`[Music] Resyncing ${songPath} to offset ${estimatedOffset.toFixed(2)}s`);
            if (estimatedOffset < audioPlayer.duration) { audioPlayer.currentTime = estimatedOffset; if (!isMuted && audioPlayer.paused) playAudio(); }
            else { console.warn(`[Music] Resync offset ${estimatedOffset} >= duration ${audioPlayer.duration}.`); }
        } else { if (!isMuted && audioPlayer.paused && hasMusicStarted) { console.log("[Music] Resuming playback locally."); playAudio(); } else if (isMuted && !audioPlayer.paused) { console.log("[Music] Pausing playback due to mute."); audioPlayer.pause(); } }
    });
    socket.on('authError', (message) => {
         console.error("Authentication Error:", message);
         alert(`Lỗi Xác thực: ${message}. Vui lòng đăng nhập lại.`);
         handleLogout(); // Force logout on auth error
     });

    // Transfer listeners
    socket.on('transferSuccess', (data) => {
        console.log("Point transfer successful:", data);
        if (localUser.userId === data.senderUid) { // Only update points if I was the sender
             localUser.points = data.newSenderPoints;
             updatePointsDisplay();
        }
        // Show message in the transfer modal if it's open
        if (transferModalWrapper?.style.display === 'flex') {
             showTemporaryMessage(transferErrorMsg, `Chuyển thành công ${data.amount.toLocaleString()} điểm cho ${data.recipientUsername || 'người nhận'}!`, 'win', 5000);
        } else {
            // Optionally show a general success message if modal closed quickly
            showTemporaryMessage(resultMessageEl, `Chuyển ${data.amount.toLocaleString()} điểm thành công!`, 'win', 3000);
        }
        if(recipientUidInput) recipientUidInput.value = ''; // Clear input on success
        if(transferAmountInput) transferAmountInput.value = '';
        if(confirmTransferBtn) confirmTransferBtn.disabled = false; // Re-enable button
        // setTimeout(closeTransferModal, 1500); // Optional: Close modal after success
    });

    socket.on('transferError', (message) => {
        console.error("Point transfer error:", message);
        if (transferModalWrapper?.style.display === 'flex') {
            showTemporaryMessage(transferErrorMsg, message, 'loss', 5000); // Show error in modal
        } else {
            // Show general error if modal not open
             showTemporaryMessage(resultMessageEl, `Lỗi chuyển điểm: ${message}`, 'loss', 5000);
        }
        if(confirmTransferBtn) confirmTransferBtn.disabled = false; // Re-enable button
    });
}

// --- Game State UI Update ---
function updateUIFromState(state) { if (!state || !state.status || state.sessionCount === undefined || state.endTime === undefined) { console.warn("Incomplete gameStateUpdate received:", state); return; } clearInterval(localTimerInterval); clearInterval(waitInterval); currentSessionCount = state.sessionCount; gameStatus = state.status; const now = Date.now(); const serverEndTime = state.endTime; switch (state.status) { case "BETTING": isBettingAllowed = true; if(sessionStatusEl) sessionStatusEl.textContent = `Phiên #${state.sessionCount}`; if(timerAreaEl) showElement(timerAreaEl); if(resultAreaEl) resultAreaEl.style.visibility = 'hidden'; if(resultCoverEl) hideElement(resultCoverEl); if(timerLabelEl) timerLabelEl.textContent = "Thời gian cược"; hasRevealedLocally = false; resetBetState(); if (resultMessageEl) { resultMessageEl.textContent = ''; resultMessageEl.className=''; resultMessageEl.style.display = 'none'; } const bettingTimeLeft = Math.max(0, Math.floor((serverEndTime - now) / 1000)); if(timerEl) timerEl.textContent = bettingTimeLeft; updateBettingUIAccess(); // Update button states etc.
        if (bettingTimeLeft > 0) { localTimerInterval = setInterval(() => { const currentNow = Date.now(); const currentLeft = Math.max(0, Math.floor((serverEndTime - currentNow) / 1000)); if(timerEl) timerEl.textContent = currentLeft; if (currentLeft <= 5 && currentLeft > 0) centerDisplayEl?.classList.add('low-time'); else centerDisplayEl?.classList.remove('low-time'); if (currentLeft <= 0) { clearInterval(localTimerInterval); if(timerLabelEl) timerLabelEl.textContent = "Hết giờ"; if(timerEl) timerEl.textContent = "⏳"; centerDisplayEl?.classList.remove('low-time'); disableBettingUI(); isBettingAllowed = false; } }, 500); } else { if(timerLabelEl) timerLabelEl.textContent = "Hết giờ"; if(timerEl) timerEl.textContent = "⏳"; disableBettingUI(); isBettingAllowed = false; } break; case "REVEALING": isBettingAllowed = false; disableBettingUI(); if(timerAreaEl) hideElement(timerAreaEl); if (!hasRevealedLocally) { if(resultAreaEl) resultAreaEl.style.visibility = 'hidden'; if(resultCoverEl) showElement(resultCoverEl); if(resultCoverEl) resultCoverEl.style.transform = `translate(0px, 0px)`; if(dice1El) dice1El.textContent = '?'; if(dice2El) dice2El.textContent = '?'; if(dice3El) dice3El.textContent = '?'; if(diceSumEl) diceSumEl.textContent = 'Tổng: ?'; if(gameOutcomeEl) gameOutcomeEl.textContent = '?'; if(gameOutcomeEl) gameOutcomeEl.className = 'result-outcome'; } else { if(resultAreaEl) resultAreaEl.style.visibility = 'visible'; if(resultCoverEl) hideElement(resultCoverEl); } if(sessionStatusEl) sessionStatusEl.textContent = `Phiên #${state.sessionCount} - Chờ kết quả...`; if (currentBetState.confirmed) { showTemporaryMessage(currentBetMessageEl, `Đã chốt cược: ${currentBetState.choice} (${currentBetState.amount.toLocaleString()})`, 'win'); } else { showTemporaryMessage(currentBetMessageEl, "Chưa đặt cược.", 'no-bet'); } break; case "WAITING": isBettingAllowed = false; disableBettingUI(); if(resultCoverEl) hideElement(resultCoverEl); if(timerAreaEl) hideElement(timerAreaEl); if(resultAreaEl) resultAreaEl.style.visibility = 'visible'; hasRevealedLocally = true; const result = state.diceResult; if (result) { if(dice1El) dice1El.textContent = result.d1; if(dice2El) dice2El.textContent = result.d2; if(dice3El) dice3El.textContent = result.d3; if(diceSumEl) diceSumEl.textContent = `Tổng: ${result.sum}`; if(gameOutcomeEl) { gameOutcomeEl.textContent = result.outcome; gameOutcomeEl.className = 'result-outcome'; if (result.isTriple) { gameOutcomeEl.classList.add('triple'); gameOutcomeEl.style.color = '#f1c40f'; } else { gameOutcomeEl.classList.add(result.outcome.toLowerCase() === 'tài' ? 'tai-outcome' : 'xiu-outcome'); } } const waitTimeLeft = Math.max(0, Math.floor((serverEndTime - now) / 1000)); if(sessionStatusEl) sessionStatusEl.textContent = `Phiên #${state.sessionCount} - KQ: ${result.outcome}. Phiên mới sau ${waitTimeLeft}s...`; if (waitTimeLeft > 0) { waitInterval = setInterval(() => { const currentNowWait = Date.now(); const currentWaitLeft = Math.max(0, Math.floor((serverEndTime - currentNowWait) / 1000)); if (currentWaitLeft >= 0) { if(sessionStatusEl) sessionStatusEl.textContent = `Phiên #${state.sessionCount} - KQ: ${result.outcome}. Phiên mới sau ${currentWaitLeft}s...`; } if (currentWaitLeft <= 0) { clearInterval(waitInterval); if(sessionStatusEl) sessionStatusEl.textContent = `Phiên #${state.sessionCount} - KQ: ${result.outcome}. Chuẩn bị...`; } }, 1000); } else { if(sessionStatusEl) sessionStatusEl.textContent = `Phiên #${state.sessionCount} - KQ: ${result.outcome}. Chuẩn bị...`; } } else { console.warn("WAITING state without diceResult!"); if(sessionStatusEl) sessionStatusEl.textContent = `Phiên #${state.sessionCount} - Đang xử lý kết quả...`; } break; default: console.error("Unknown game state from server:", state.status); if(sessionStatusEl) sessionStatusEl.textContent = "Trạng thái không xác định!"; disableBettingUI(); isBettingAllowed = false; } }

// --- Initialization ---
function initializeGame() {
    if (isGameInitialized) return;
    console.log("Running initializeGame()");
    localUser.isDev = false;
    hasShownCongratsPopup = false;
    updateSimpleHistoryDisplay();
    updateMusicButtonIcon();
    updateHeaderDisplay();
    updatePointsDisplay();
    updateChatVisibility();
    updateVerificationStatusUI();
    updateUIAfterAuthChange(); // Initial UI setup based on potential early auth state

    if (devSongSelect) { devSongSelect.innerHTML = '<option value="">-- Chọn bài --</option>'; musicFiles.forEach(filePath => { const option = document.createElement('option'); option.value = filePath; option.textContent = filePath.split('/').pop(); devSongSelect.appendChild(option); }); }

    // Event Listeners
    if(chatSendBtn) chatSendBtn.addEventListener('click', sendMessage);
    if(chatInput) chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
    if(betTaiButton) betTaiButton.addEventListener('click', () => handleBet('Tài'));
    if(betXiuButton) betXiuButton.addEventListener('click', () => handleBet('Xỉu'));
    if(cancelBetBtn) cancelBetBtn.addEventListener('click', handleCancelBet);
    if(toggleHistoryBtn) toggleHistoryBtn.addEventListener('click', toggleDetailedHistory);
    if(closeHistoryBtn) closeHistoryBtn.addEventListener('click', toggleDetailedHistory);
    if(settingsBtn) settingsBtn.addEventListener('click', toggleSettingsModal);
    if(closeSettingsBtn) closeSettingsBtn.addEventListener('click', toggleSettingsModal);
    if(saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);
    if(avatarSelectionContainer) avatarSelectionContainer.addEventListener('click', handleAvatarSelection);
    if(resultCoverEl) resultCoverEl.addEventListener('mousedown', startDrag);
    if(resultCoverEl) resultCoverEl.addEventListener('touchstart', startDrag, { passive: false });
    if(restartGameBtn) restartGameBtn.addEventListener('click', restartGame);
    if(unlockDevBtn) unlockDevBtn.addEventListener('click', unlockDeveloperSettings);
    if(skipCountdownBtn) skipCountdownBtn.addEventListener('click', skipCountdown);
    if(devSetPointsBtn) devSetPointsBtn.addEventListener('click', devSetPoints);
    if(infoBtn) infoBtn.addEventListener('click', toggleInfoModal);
    if(closeInfoBtn) closeInfoBtn.addEventListener('click', toggleInfoModal);
    if(infoModalWrapperEl) infoModalWrapperEl.addEventListener('click', (event) => { if (event.target === infoModalWrapperEl) toggleInfoModal(); });
    if(toggleMusicBtn) toggleMusicBtn.addEventListener('click', toggleMusic);
    if(skipSongBtn) skipSongBtn.addEventListener('click', devSkipSong);
    if(closeCongratsBtnConfirm) closeCongratsBtnConfirm.addEventListener('click', hideCongratsPopup);
    if(congratsModalWrapper) congratsModalWrapper.addEventListener('click', (event) => { if (event.target === congratsModalWrapper) hideCongratsPopup(); });
    if(logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if(sendVerificationBtn) sendVerificationBtn.addEventListener('click', async () => { const now = Date.now(); if (now < lastVerificationRequestTime + VERIFICATION_COOLDOWN_MS) { const remainingSeconds = Math.ceil((lastVerificationRequestTime + VERIFICATION_COOLDOWN_MS - now) / 1000); const minutes = Math.floor(remainingSeconds / 60); const seconds = remainingSeconds % 60; alert(`Vui lòng đợi ${minutes} phút ${seconds} giây trước khi gửi lại email.`); return; } if (socket && socket.connected && !localUser.isGuest && !localUser.isVerified) { const idToken = await getIdToken(); if(!idToken) return; console.log("Requesting verification email resend..."); sendVerificationBtn.disabled = true; sendVerificationBtn.textContent = 'Đang gửi...'; socket.emit('requestVerificationEmail', { token: idToken }); } else { alert("Không thể gửi yêu cầu lúc này."); } });
    if (devPlaySongBtn) devPlaySongBtn.addEventListener('click', devPlaySelectedSong);
    if(audioPlayer) { audioPlayer.addEventListener('error', (e) => { console.error('Audio Error:', audioPlayer.error, e); }); audioPlayer.muted = isMuted; }
    togglePasswordBtns.forEach(btn => btn.addEventListener('click', togglePasswordVisibility));
    loginPasswordInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleLogin(); } });
    registerPasswordInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleRegister(); } });
	if (newMessagesIndicator) {
        newMessagesIndicator.addEventListener('click', () => {
            scrollToBottom(chatMessages);
            newMessagesIndicator.style.display = 'none'; // Hide after clicking
        });
    }
    if (chatMessages) {
        chatMessages.addEventListener('scroll', () => {
            // Hide indicator if user scrolls near bottom
            if (chatMessages.scrollHeight - chatMessages.clientHeight <= chatMessages.scrollTop + 10) { // Added tolerance
                if (newMessagesIndicator) newMessagesIndicator.style.display = 'none';
            }
        });
    }

    // Transfer Points Listeners
    if(transferPointsBtn) transferPointsBtn.addEventListener('click', openTransferModal);
    if(closeTransferModalBtn) closeTransferModalBtn.addEventListener('click', closeTransferModal);
    if(transferModalWrapper) transferModalWrapper.addEventListener('click', (event) => {
        if (event.target === transferModalWrapper) closeTransferModal();
    });
    if(copyUidBtn) copyUidBtn.addEventListener('click', copyMyUid);
    if(confirmTransferBtn) confirmTransferBtn.addEventListener('click', handleConfirmTransfer);


    setupSocketListeners(); // Setup socket listeners
    isGameInitialized = true;
    console.log("Game Initialized. Waiting for server connection and state...");
    if(sessionStatusEl) sessionStatusEl.textContent = "Đang kết nối server... (tải lại trang nếu đợi quá 1 phút)";
    disableBettingUI(); // Initially disable betting UI
    if(cancelBetBtn) cancelBetBtn.disabled = true; // Ensure cancel is initially disabled
}

function handleWarningAccept() { console.log("Warning Accepted"); hideModal(entryWarningModal); showModal(authModal); switchAuthTab('login'); }
function showGameAndInitializeIfNeeded() { console.log("Showing game wrapper"); if(gameWrapper) showElement(gameWrapper); if (!isGameInitialized) { console.log("Initializing game..."); initializeGame(); } else { console.log("Game already initialized."); if (socket && !socket.connected) { console.log("Attempting to reconnect socket..."); socket.connect(); } else if (!socket) { console.warn("Socket missing on re-show. Re-initializing."); initializeGame(); } } }

// --- Keep-Alive Ping Function ---
function keepAlivePing() {
    if (!PING_URL) return;
    console.log(`[KeepAlive] Pinging server at ${PING_URL}...`);
    fetch(PING_URL, { method: 'GET' })
        .then(response => {
            if (response.ok) { console.log(`[KeepAlive] Ping successful (Status: ${response.status}).`); }
            else { console.warn(`[KeepAlive] Ping request sent, but server responded with status: ${response.status}`); }
        })
        .catch(error => { console.error('[KeepAlive] Ping failed:', error); });
}

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed.");
    // Configuration presence checks happen early, before Firebase init

    acceptWarningBtn?.addEventListener('click', handleWarningAccept);
    loginTabBtn?.addEventListener('click', () => switchAuthTab('login'));
    registerTabBtn?.addEventListener('click', () => switchAuthTab('register'));
    loginBtn?.addEventListener('click', handleLogin);
    registerBtn?.addEventListener('click', handleRegister);
    playGuestBtn?.addEventListener('click', handlePlayGuest);
    showAuthModalBtn?.addEventListener('click', () => { showModal(authModal); switchAuthTab('login'); });

    togglePasswordBtns.forEach(btn => btn.addEventListener('click', togglePasswordVisibility));
    loginPasswordInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleLogin(); } });
    registerPasswordInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleRegister(); } });

    console.log("Initial modal listeners attached.");

    // --- Start: Ping Logic ---
    console.log(`Initial ping to server at ${PING_URL}...`);
    fetch(PING_URL, { method: 'GET' })
        .then(response => console.log(`Initial server ping response status: ${response.status}`))
        .catch(error => console.error('Initial server ping failed:', error))
        .finally(() => {
            console.log("Proceeding with initial UI setup after initial ping attempt...");
        });

    setInterval(keepAlivePing, PING_INTERVAL_MS);
    console.log(`[KeepAlive] Periodic ping every ${PING_INTERVAL_MS / 1000 / 60} minutes initialized.`);
    // --- End: Ping Logic ---

    if (entryWarningModal) showModal(entryWarningModal);
    // Game initialization will happen *after* the warning is accepted and auth/guest choice via showGameAndInitializeIfNeeded()
});