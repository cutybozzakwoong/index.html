/* ==========================================================================
   Smart Class Phone Lock - Interactive Logic & Audio Engine (app.js)
   ========================================================================== */

// 1. Premium Audio Synthesis Engine (Web Audio API)
class ClassroomSoundSynth {
  constructor() {
    this.ctx = null;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.sirenInterval = null;
    this.isSirenPlaying = false;
  }

  // Lazy initialize the audio context to bypass autoplay restrictions
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Chime 1: Lock sweep (Futuristic descending high-tech lock sound)
  playLock() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  }

  // Chime 2: Unlock sweep (Bright ascending double beep)
  playUnlock() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5 -> E5 -> G5

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.18);
      });
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  }

  // Chime 3: Submit phone (Satisfying digital coin chime)
  playSubmit() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.08); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1174.66, now + 0.08); // D6

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.35);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  }

  // Chime 4: Loopable Wailing Alarm Siren (Synthesizes realistic ambulance/siren pitch sweeps)
  startSiren() {
    if (this.isSirenPlaying) return;
    try {
      this.init();
      this.isSirenPlaying = true;
      const now = this.ctx.currentTime;
      
      this.sirenOsc = this.ctx.createOscillator();
      this.sirenGain = this.ctx.createGain();
      
      this.sirenOsc.type = 'sawtooth';
      this.sirenOsc.frequency.setValueAtTime(600, now);
      
      // Infinite pitch sweep between 500Hz and 1000Hz every 0.6 seconds
      this.sirenOsc.frequency.linearRampToValueAtTime(1000, now + 0.3);
      
      this.sirenGain.gain.setValueAtTime(0.15, now);
      
      this.sirenOsc.connect(this.sirenGain);
      this.sirenGain.connect(this.ctx.destination);
      
      this.sirenOsc.start(now);
      
      let up = true;
      this.sirenInterval = setInterval(() => {
        if (!this.ctx || this.ctx.state === 'suspended') return;
        const curTime = this.ctx.currentTime;
        if (up) {
          this.sirenOsc.frequency.linearRampToValueAtTime(500, curTime + 0.3);
        } else {
          this.sirenOsc.frequency.linearRampToValueAtTime(1000, curTime + 0.3);
        }
        up = !up;
      }, 300);

    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  }

  stopSiren() {
    if (!this.isSirenPlaying) return;
    try {
      if (this.sirenInterval) {
        clearInterval(this.sirenInterval);
        this.sirenInterval = null;
      }
      if (this.sirenOsc) {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
        this.sirenOsc = null;
      }
      if (this.sirenGain) {
        this.sirenGain.disconnect();
        this.sirenGain = null;
      }
      this.isSirenPlaying = false;
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  }
}

// 2. Class State Configuration & Quotes
const synth = new ClassroomSoundSynth();

const studyQuotes = [
  "오늘 걷지 않으면 내일은 뛰어야 한다.",
  "공부할 때 느끼는 고통은 잠깐이지만, 못 배운 고통은 평생이다.",
  "늦었다고 생각할 때가 가장 늦은 때다. 그러니 지금 시작하라.",
  "포기하고 싶은 그 순간, 바로 시작할 때이다.",
  "미래의 네가 오늘의 너에게 감사하도록 행동하라.",
  "공부는 시간 투자가 아니라 고도의 집중력 싸움이다.",
  "최고가 되기 위해선 먼저 집중하는 법을 배워야 한다.",
  "배움에는 끝이 없고, 집중은 그 문을 여는 열쇠이다.",
  "소음 속에 귀 닫고, 목표를 향해 눈을 떠라."
];

// Application State Object
const AppState = {
  classLocked: false,
  classDuration: 50 * 60, // Default 50 minutes in seconds
  classTimeRemaining: 50 * 60,
  timerInterval: null,
  
  students: Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    submitted: false,
    holding: true,
    cheating: false,
    focusPoints: 0,
    phoneWakeState: false, // OFF by default
  })),

  activeStudentId: 1, // Student selected in simulator
  cheatingCount: 0
};

// DOM Node References
const elements = {
  presetButtons: document.querySelectorAll('.btn-preset'),
  classTimerDisplay: document.getElementById('class-timer-display'),
  btnLockClass: document.getElementById('btn-lock-class'),
  btnUnlockClass: document.getElementById('btn-unlock-class'),
  btnMuteSiren: document.getElementById('btn-mute-siren'),
  
  focusRateText: document.getElementById('focus-rate-text'),
  focusRateBar: document.getElementById('focus-rate-bar'),
  counterSubmitted: document.getElementById('counter-submitted'),
  counterCheating: document.getElementById('counter-cheating'),
  
  focusLeaderboard: document.getElementById('focus-leaderboard'),
  classroomLogs: document.getElementById('classroom-logs'),
  btnClearLogs: document.getElementById('btn-clear-logs'),
  
  selectedStudentIndicator: document.getElementById('selected-student-indicator'),
  phoneRackGrid: document.getElementById('phone-rack-grid'),
  activeStudentSelect: document.getElementById('active-student-select'),
  
  phoneHardwareDevice: document.getElementById('phone-hardware-device'),
  btnPhonePower: document.getElementById('btn-phone-power'),
  phoneScreenArea: document.getElementById('phone-screen-area'),
  
  // Screen States
  screenOff: document.getElementById('screen-state-off'),
  screenHome: document.getElementById('screen-state-home'),
  screenLocked: document.getElementById('screen-state-locked'),
  screenCheating: document.getElementById('screen-state-cheating'),
  
  // Dynamic Elements in Screen
  phoneStatusTime: document.getElementById('phone-status-time'),
  phoneStatusBattery: document.getElementById('phone-status-battery'),
  widgetClockTime: document.getElementById('widget-clock-time'),
  lockQuote: document.getElementById('lock-quote'),
  simulatedPointsDisplay: document.getElementById('simulated-points-display'),
  cheatingStudentNum: document.getElementById('cheating-student-num'),
  phoneToast: document.getElementById('phone-toast'),
  phoneToastText: document.getElementById('phone-toast-text'),
  
  // Simulator Action Buttons
  btnSubmitPhone: document.getElementById('btn-submit-phone'),
  btnRetrievePhone: document.getElementById('btn-retrieve-phone'),
  btnCloseWarning: document.getElementById('btn-close-warning'),
  btnSimPeek: document.getElementById('btn-sim-peek'),
  
  // Teacher Msg
  teacherMsgInput: document.getElementById('teacher-msg-input'),
  btnSendToast: document.getElementById('btn-send-toast')
};

// 3. Application Lifecycle Initializer
document.addEventListener('DOMContentLoaded', () => {
  initAppLayout();
  setupEventListeners();
  updateAnalytics();
  updateSimulatorUI();
  updateLeaderboard();
});

// Setup Initial Dynamic Structures (Dropdown & Locker Slots)
function initAppLayout() {
  // 1. Generate options for student dropdown selection
  elements.activeStudentSelect.innerHTML = '';
  for (let i = 1; i <= 30; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${i}번 학생`;
    elements.activeStudentSelect.appendChild(opt);
  }

  // 2. Generate 30 slots for classroom smartphone locker
  elements.phoneRackGrid.innerHTML = '';
  AppState.students.forEach(student => {
    const slot = document.createElement('div');
    slot.className = 'rack-cell holding';
    slot.id = `rack-slot-${student.id}`;
    
    slot.innerHTML = `
      <span class="rack-cell-num">${String(student.id).padStart(2, '0')}</span>
      <div class="status-indicator"></div>
    `;

    // Click handler to connect locker grids to student simulator
    slot.addEventListener('click', () => {
      selectStudent(student.id);
    });

    elements.phoneRackGrid.appendChild(slot);
  });

  // Default active student selection
  selectStudent(1);
  updateStatusTime();
}

// 4. UI Actions & View Syncs
function selectStudent(studentId) {
  AppState.activeStudentId = studentId;
  elements.activeStudentSelect.value = studentId;
  elements.selectedStudentIndicator.textContent = `선택: ${studentId}번 학생`;

  // Visual selection borders
  document.querySelectorAll('.rack-cell').forEach(c => c.classList.remove('selected-sim'));
  const activeSlot = document.getElementById(`rack-slot-${studentId}`);
  if (activeSlot) {
    activeSlot.classList.add('selected-sim');
  }

  updateSimulatorUI();
}

// Draw state mapping of the current student to the 3D smartphone simulator screen
function updateSimulatorUI() {
  const s = AppState.students.find(student => student.id === AppState.activeStudentId);
  if (!s) return;

  // Set fake battery indicator based on Student ID to look realistic (e.g. 50% to 100%)
  const fakeBattery = 50 + (s.id * 1.6);
  elements.phoneStatusBattery.textContent = `${Math.floor(fakeBattery)}%`;

  // Hide all screens first
  elements.screenOff.classList.remove('active');
  elements.screenHome.classList.remove('active');
  elements.screenLocked.classList.remove('active');
  elements.screenCheating.classList.remove('active');

  // Determine current active simulator display
  if (!s.phoneWakeState) {
    elements.screenOff.classList.add('active');
  } else if (s.cheating) {
    elements.cheatingStudentNum.textContent = `${String(s.id).padStart(2, '0')}번 학생`;
    elements.screenCheating.classList.add('active');
  } else if (s.submitted || (AppState.classLocked && !s.holding)) {
    // Submitted or locked down
    elements.simulatedPointsDisplay.textContent = `${s.focusPoints} pt`;
    // Select random study quote
    const randQuote = studyQuotes[(s.id + s.focusPoints) % studyQuotes.length];
    elements.lockQuote.textContent = `"${randQuote}"`;
    elements.screenLocked.classList.add('active');
  } else {
    // Normal unlocked home screen
    elements.screenHome.classList.add('active');
  }
}

// Refresh class stats counters and focus progress bar
function updateAnalytics() {
  const total = AppState.students.length;
  const submittedCount = AppState.students.filter(s => s.submitted).length;
  const cheatingCount = AppState.students.filter(s => s.cheating).length;

  elements.counterSubmitted.textContent = `${submittedCount} / ${total}명`;
  elements.counterCheating.textContent = `${AppState.cheatingCount}회`;

  // Focus Rate Calculation:
  // Submitted phones contribute 100% focus. Holding phones contribute 0%. Cheating phones pull class focus down.
  let focusRate = Math.round((submittedCount / total) * 100);
  if (cheatingCount > 0) {
    focusRate = Math.max(0, focusRate - (cheatingCount * 15));
  }

  elements.focusRateText.textContent = `${focusRate}%`;
  elements.focusRateBar.style.width = `${focusRate}%`;

  // Pulsing red indicator on bar if cheating occurs
  if (cheatingCount > 0) {
    elements.focusRateBar.style.background = 'linear-gradient(90deg, #ff0844 0%, #ff9f43 100%)';
    elements.focusRateBar.style.boxShadow = '0 0 12px rgba(255, 8, 68, 0.6)';
  } else {
    elements.focusRateBar.style.background = 'linear-gradient(90deg, #4f46e5 0%, #00f2fe 100%)';
    elements.focusRateBar.style.boxShadow = '0 0 10px rgba(0, 242, 254, 0.5)';
  }
}

// Dynamic Sorting of Focus Points Leaderboard
function updateLeaderboard() {
  // Sort students descending by focusPoints
  const sorted = [...AppState.students]
    .filter(s => s.focusPoints > 0)
    .sort((a, b) => b.focusPoints - a.focusPoints)
    .slice(0, 5);

  elements.focusLeaderboard.innerHTML = '';
  
  if (sorted.length === 0) {
    elements.focusLeaderboard.innerHTML = `<li class="empty-leaderboard">수업이 시작되면 순위가 산정됩니다.</li>`;
    return;
  }

  sorted.forEach((student, idx) => {
    const li = document.createElement('li');
    li.className = 'leaderboard-item';

    const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'rank-normal';
    li.innerHTML = `
      <div>
        <span class="leaderboard-rank-badge ${rankClass}">${idx + 1}</span>
        <strong>${student.id}번 학생</strong>
      </div>
      <span class="leaderboard-points">${student.focusPoints} pt</span>
    `;

    elements.focusLeaderboard.appendChild(li);
  });
}

// Log Feed System (Append alerts & scroll automatically)
function appendLog(message, type = 'info') {
  // Clear default notice
  const emptyMsg = elements.classroomLogs.querySelector('.empty-log');
  if (emptyMsg) emptyMsg.remove();

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const li = document.createElement('li');
  li.className = `log-item ${type === 'warn' ? 'log-warn' : type === 'success' ? 'log-success' : ''}`;
  li.innerHTML = `
    <span class="log-timestamp">[${timeStr}]</span>
    <span class="log-text">${message}</span>
  `;

  elements.classroomLogs.appendChild(li);
  
  // Keep logs list capped at 50 to avoid memory overflow
  while (elements.classroomLogs.children.length > 50) {
    elements.classroomLogs.removeChild(elements.classroomLogs.firstChild);
  }

  // Scroll to bottom
  elements.classroomLogs.parentElement.scrollTop = elements.classroomLogs.parentElement.scrollHeight;
}

// Synchronize virtual status time to current browser local time
function updateStatusTime() {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  elements.phoneStatusTime.textContent = timeStr;
  elements.widgetClockTime.textContent = timeStr;
}

// Helper: Show iOS Style Push notification toast on simulated screen
function triggerToastNotification(msg) {
  elements.phoneToastText.textContent = msg;
  elements.phoneToast.classList.add('show');
  
  // Chime click synth sound
  synth.playUnlock();

  setTimeout(() => {
    elements.phoneToast.classList.remove('show');
  }, 4000);
}

// Sync individual locker box states in the grid
function syncLockerSlot(studentId) {
  const s = AppState.students.find(student => student.id === studentId);
  const slot = document.getElementById(`rack-slot-${studentId}`);
  if (!s || !slot) return;

  // Reset statuses
  slot.className = 'rack-cell';
  
  if (s.cheating) {
    slot.classList.add('cheating');
  } else if (s.submitted) {
    slot.classList.add('submitted');
  } else {
    slot.classList.add('holding');
  }

  // Ensure selection outlines are preserved
  if (studentId === AppState.activeStudentId) {
    slot.classList.add('selected-sim');
  }
}

// 5. Classroom Session & Clock Logic
function startClassSession() {
  AppState.classLocked = true;
  elements.btnLockClass.disabled = true;
  elements.btnLockClass.classList.add('disabled');
  elements.btnLockClass.querySelector('.btn-text').textContent = '🔒 집중 잠금 진행 중...';
  elements.btnUnlockClass.disabled = false;
  
  // Audio Lock
  synth.playLock();
  appendLog("수업이 시작되었습니다! 스마트폰 집중 강제 잠금을 활성화합니다.", "success");

  // Synchronize submitted students' virtual phones to LOCKED screen state instantly
  AppState.students.forEach(s => {
    if (s.submitted) {
      syncLockerSlot(s.id);
    }
  });

  // Turn class analytics green
  updateAnalytics();
  updateSimulatorUI();

  // Timer loop initialization
  AppState.timerInterval = setInterval(() => {
    AppState.classTimeRemaining--;
    
    // Timer display formatting
    const minutes = Math.floor(AppState.classTimeRemaining / 60);
    const seconds = AppState.classTimeRemaining % 60;
    elements.classTimerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Point scoring tick: students who have submitted earn +5 pt every second
    AppState.students.forEach(s => {
      if (s.submitted && !s.cheating) {
        s.focusPoints += 5;
      }
    });

    // Update screen components live
    updateSimulatorUI();
    updateLeaderboard();
    updateAnalytics();
    updateStatusTime();

    if (AppState.classTimeRemaining <= 0) {
      stopClassSession(true);
    }
  }, 1000);
}

function stopClassSession(isComplete = false) {
  AppState.classLocked = false;
  clearInterval(AppState.timerInterval);
  AppState.timerInterval = null;

  elements.btnLockClass.disabled = false;
  elements.btnLockClass.classList.remove('disabled');
  elements.btnLockClass.querySelector('.btn-text').textContent = '🔒 일괄 수업 잠금 시작';
  elements.btnUnlockClass.disabled = true;

  // Stop sirens if sounding
  synth.stopSiren();
  elements.btnMuteSiren.classList.add('hidden');
  
  AppState.students.forEach(s => {
    s.cheating = false;
    syncLockerSlot(s.id);
  });

  if (isComplete) {
    synth.playUnlock();
    alert("🎉 수업 시간이 종료되었습니다! 스마트폰 잠금이 해제됩니다. 집중 포인트를 확인하세요!");
    appendLog("수업 종료 시간 도달! 일괄 스마트폰 잠금이 안전하게 해제되었습니다.", "success");
    // Soft reset time remaining
    const activePreset = document.querySelector('.btn-preset.active');
    const timePreset = activePreset ? parseInt(activePreset.dataset.time, 10) : 50;
    AppState.classTimeRemaining = timePreset * 60;
    elements.classTimerDisplay.textContent = `${String(timePreset).padStart(2, '0')}:00`;
  } else {
    synth.playUnlock();
    appendLog("교사의 제어로 집중 잠금을 일시 정지 및 해제합니다.", "info");
  }

  updateSimulatorUI();
  updateAnalytics();
  updateLeaderboard();
}

// 6. Interactive Event Bindings
function setupEventListeners() {
  
  // 1. Session Duration Presets
  elements.presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (AppState.classLocked) {
        alert("수업이 진행 중일 때는 시간을 변경할 수 없습니다!");
        return;
      }

      elements.presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const val = parseInt(btn.dataset.time, 10);
      AppState.classDuration = val * 60;
      AppState.classTimeRemaining = AppState.classDuration;
      elements.classTimerDisplay.textContent = `${String(val).padStart(2, '0')}:00`;
    });
  });

  // 2. Lock & Unlock commands
  elements.btnLockClass.addEventListener('click', () => {
    if (AppState.classLocked) return;
    startClassSession();
  });

  elements.btnUnlockClass.addEventListener('click', () => {
    if (!AppState.classLocked) return;
    stopClassSession(false);
  });

  // 3. Mute siren trigger
  elements.btnMuteSiren.addEventListener('click', () => {
    synth.stopSiren();
    elements.btnMuteSiren.classList.add('hidden');
    appendLog("비상 경보 사이렌이 무음 처리되었습니다.", "info");
  });

  // 4. Change simulated student selection dropdown
  elements.activeStudentSelect.addEventListener('change', (e) => {
    selectStudent(parseInt(e.target.value, 10));
  });

  // 5. Hardware Phone Power toggle
  elements.btnPhonePower.addEventListener('click', () => {
    const s = AppState.students.find(student => student.id === AppState.activeStudentId);
    if (!s) return;

    // Toggle wake state
    s.phoneWakeState = !s.phoneWakeState;

    if (s.phoneWakeState) {
      synth.playUnlock();
      appendLog(`${s.id}번 학생 스마트폰 화면 켜짐 (Wake)`);
      
      // CRITICAL ALERT SIMULATION: 
      // If class is locked, student has NOT submitted, and they turn screen ON -> Immediate Cheating Caught!
      if (AppState.classLocked && !s.submitted) {
        triggerCheatingCaught(s);
      }
    } else {
      synth.playLock();
      appendLog(`${s.id}번 학생 스마트폰 화면 꺼짐 (Sleep)`);
    }

    updateSimulatorUI();
    updateAnalytics();
  });

  // 6. Simulator: Submit phone to locker
  elements.btnSubmitPhone.addEventListener('click', () => {
    const s = AppState.students.find(student => student.id === AppState.activeStudentId);
    if (!s) return;

    s.submitted = true;
    s.holding = false;
    s.cheating = false; // Reset cheating state if they decide to submit
    
    synth.playSubmit();
    appendLog(`${s.id}번 학생이 스마트폰을 보관함에 안전하게 제출했습니다.`, "success");
    
    // Stop siren if no other student is cheating
    checkClassroomSirens();

    syncLockerSlot(s.id);
    updateSimulatorUI();
    updateAnalytics();
  });

  // 7. Simulator: Retrieve phone from locker
  elements.btnRetrievePhone.addEventListener('click', () => {
    const s = AppState.students.find(student => student.id === AppState.activeStudentId);
    if (!s) return;

    s.submitted = false;
    s.holding = true;

    synth.playUnlock();
    appendLog(`${s.id}번 학생이 스마트폰을 보관함에서 회수해 갔습니다.`, "info");

    syncLockerSlot(s.id);
    updateSimulatorUI();
    updateAnalytics();
  });

  // 8. Simulator: Student shuts off screen apologizing
  elements.btnCloseWarning.addEventListener('click', () => {
    const s = AppState.students.find(student => student.id === AppState.activeStudentId);
    if (!s) return;

    s.cheating = false;
    s.phoneWakeState = false; // Turned screen off in panic

    synth.playLock();
    appendLog(`${s.id}번 학생이 잘못을 인지하고 급히 스마트폰 화면을 종료했습니다.`, "info");

    checkClassroomSirens();
    syncLockerSlot(s.id);
    updateSimulatorUI();
    updateAnalytics();
  });

  // 9. Simulator: Force Cheating Simulation Trigger
  elements.btnSimPeek.addEventListener('click', () => {
    const s = AppState.students.find(student => student.id === AppState.activeStudentId);
    if (!s) return;

    if (!AppState.classLocked) {
      alert("집중 수업 잠금 상태가 아닙니다! 먼저 교사 제어판에서 '일괄 수업 잠금 시작' 버튼을 클릭해 주세요!");
      return;
    }

    if (s.submitted) {
      alert(`${s.id}번 학생은 이미 보관함에 폰을 제출했기 때문에 몰래 볼 수 없습니다! (폰 제출 해제 후 시도해 주세요)`);
      return;
    }

    // Wake device and trigger cheat
    s.phoneWakeState = true;
    triggerCheatingCaught(s);

    updateSimulatorUI();
    updateAnalytics();
  });

  // 10. Teacher Custom Notification Push message
  elements.btnSendToast.addEventListener('click', () => {
    const msg = elements.teacherMsgInput.value.trim();
    if (!msg) return;

    const s = AppState.students.find(student => student.id === AppState.activeStudentId);
    if (!s) return;

    if (!s.phoneWakeState) {
      alert(`${s.id}번 학생의 스마트폰 화면이 꺼져 있습니다. 화면을 켠 후 전송해 주세요!`);
      return;
    }

    triggerToastNotification(msg);
    appendLog(`선생님이 ${s.id}번 학생 스마트폰에 메세지를 푸시했습니다: "${msg}"`);
  });

  elements.btnClearLogs.addEventListener('click', () => {
    elements.classroomLogs.innerHTML = `<li class="empty-log">실시간 감지 로그가 여기에 표시됩니다.</li>`;
  });
}

// 7. Cheating / Warning Logic Handler
function triggerCheatingCaught(student) {
  student.cheating = true;
  AppState.cheatingCount++;
  
  // Play sirens
  synth.startSiren();
  elements.btnMuteSiren.classList.remove('hidden');

  appendLog(`🚨 비상! ${student.id}번 학생이 수업 몰래 폰을 조작하다 감지되었습니다!`, "warn");
  syncLockerSlot(student.id);
}

// Verify if there are other students actively cheating in classroom, keep sirens active if true
function checkClassroomSirens() {
  const activeCheaters = AppState.students.some(s => s.cheating);
  if (!activeCheaters) {
    synth.stopSiren();
    elements.btnMuteSiren.classList.add('hidden');
  }
}
