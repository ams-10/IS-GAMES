const state = {
  completed: JSON.parse(localStorage.getItem("cyberQuestCompleted") || "[]"),
  currentGame: null,
  finished: false,
  timer: null,
  advanceTimer: null
};

const phishingMessages = [
  {
    type: "Email", name: "IT Service Desk", email: "support@company-helpdesk.co", time: "9:14 AM",
    subject: "URGENT: Your mailbox will be deleted today",
    body: "We found a storage error on your account. Confirm your details right now or your email and files will be deleted for good.",
    link: "company-login.secure-verify.co", answer: "phish",
    clue: "The web link and sender use a look-alike outside address, and it rushes you with a scary deadline."
  },
  {
    type: "Email", name: "Maya Chen", email: "maya.chen@yourcompany.com", time: "10:02 AM",
    subject: "Updated agenda for Thursday's project review",
    body: "Hi team, I added the budget item we discussed yesterday. The updated agenda is in our usual shared folder.",
    link: "yourcompany.sharepoint.com/sites/project-north", answer: "safe",
    clue: "It comes from a real coworker's address, fits a conversation you expected, and points to your normal work site."
  },
  {
    type: "Text", name: "Payroll Alert", email: "+1 (415) 555-0132", time: "11:37 AM",
    subject: "",
    body: "Your salary payment was rejected. Re-enter your bank details in the next 2 hours to get paid: pay-fix.info/login",
    link: "pay-fix.info/login", answer: "phish",
    clue: "Real payroll won't text a random web link and demand your bank details under a countdown."
  },
  {
    type: "Email", name: "Facilities", email: "facilities@yourcompany.com", time: "1:18 PM",
    subject: "Fire drill Wednesday at 10 AM",
    body: "Friendly reminder: the quarterly fire drill starts at 10 AM Wednesday. Follow your floor warden to the assembly point.",
    link: "", answer: "safe",
    clue: "It's just information from your company's address and asks for no passwords, money, or clicks."
  },
  {
    type: "Chat", name: "DocuSign", email: "documents@docuslgn-mail.com", time: "3:46 PM",
    subject: "Confidential agreement awaiting your signature",
    body: "Please sign before 5 PM. Because this is confidential, do not contact your manager about it.",
    link: "docuslgn-mail.com/open/83910", answer: "phish",
    clue: "The address swaps the letter i for an l, and telling you to keep it secret is a classic pressure trick."
  },
  {
    type: "Text", name: "Bank", email: "+1 (888) 555-0177", time: "8:05 AM",
    subject: "",
    body: "We blocked a $780 charge. If this wasn't you, reply STOP. If it was you, no action needed.",
    link: "", answer: "safe",
    clue: "No link and nothing sensitive requested \u2014 a simple heads-up. Still, verify by calling the number on your card."
  },
  {
    type: "Email", name: "Prize Team", email: "winner@rewards-zone.online", time: "2:30 PM",
    subject: "You've won a $500 gift card!",
    body: "Congratulations! You were selected today. Claim your reward now \u2014 just pay a small $3 delivery fee with your card.",
    link: "rewards-zone.online/claim", answer: "phish",
    clue: "Surprise prizes that ask for your card for a 'small fee' are scams. You can't win a contest you never entered."
  },
  {
    type: "Chat", name: "Alex (Manager)", email: "Microsoft Teams", time: "4:12 PM",
    subject: "",
    body: "Quick one before my meeting \u2014 can you buy five $100 gift cards for a client and send me the codes? I'll expense it.",
    link: "", answer: "phish",
    clue: "A boss asking for secret gift-card codes in a hurry is a well-known scam, even when the name looks right. Confirm in person."
  }
];

const responseSteps = [
  { id: 1, text: "Unplug it from the internet (Wi-Fi and cables)" },
  { id: 2, text: "Call IT or the security team" },
  { id: 3, text: "Write down what happened and when" },
  { id: 4, text: "Do what the security team tells you" }
];

const homeScreen = document.querySelector("#home-screen");
const gameScreen = document.querySelector("#game-screen");
const gameArea = document.querySelector("#game-area");
const gameTitle = document.querySelector("#game-title");
const gameKicker = document.querySelector("#game-kicker");
const gameProgress = document.querySelector("#game-progress");

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  markCompletedCards();
  setupSignalCanvas();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js");
});

document.querySelectorAll(".mission-card").forEach((button) => {
  button.addEventListener("click", () => startGame(button.dataset.game));
});

document.querySelector("#back-button").addEventListener("click", showHome);

function startGame(game) {
  clearInterval(state.timer);
  clearTimeout(state.advanceTimer);
  state.currentGame = game;
  state.finished = false;
  homeScreen.classList.remove("active");
  gameScreen.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (game === "phishing") startPhishing();
  if (game === "password") startPassword();
  if (game === "response") startResponse();
  if (game === "spot") startSpot();
  if (game === "deepfake") startDeepfake();
  if (game === "escape") startEscape();
  if (game === "crossword") startCrossword();
  if (game === "data") startDataDefender();
  if (game === "match") startMatch();
}

function showHome() {
  clearInterval(state.timer);
  clearTimeout(state.advanceTimer);
  state.finished = true;
  gameScreen.classList.remove("active");
  homeScreen.classList.add("active");
  gameArea.replaceChildren();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startPhishing() {
  gameKicker.textContent = "GAME 01";
  gameTitle.textContent = "Phish Swipe";
  gameArea.append(document.querySelector("#phishing-template").content.cloneNode(true));
  if (window.lucide) lucide.createIcons();

  const deck = shuffle([...phishingMessages]);
  const card = document.querySelector("#swipe-card");
  const feedback = document.querySelector("#swipe-feedback");
  const timeEl = document.querySelector("#swipe-timer");
  let index = 0;
  let reviewed = 0;
  let correct = 0;
  let seconds = 90;
  let busy = false;

  function current() { return deck[index]; }

  function render() {
    const item = current();
    card.style.transition = "none";
    card.style.transform = "translateX(0) rotate(0deg)";
    card.style.opacity = "1";
    card.dataset.hint = "";
    document.querySelector("#swipe-kind").textContent = item.type;
    document.querySelector("#swipe-from").textContent = item.name;
    document.querySelector("#swipe-handle").textContent = item.email;
    document.querySelector("#swipe-msgtime").textContent = item.time;
    const subject = document.querySelector("#swipe-subject");
    subject.textContent = item.subject;
    subject.hidden = !item.subject;
    document.querySelector("#swipe-body").textContent = item.body;
    const link = document.querySelector("#swipe-link");
    link.textContent = item.link;
    link.hidden = !item.link;
  }

  function flash(ok, text) {
    feedback.className = `swipe-feedback show ${ok ? "correct" : "wrong"}`;
    feedback.innerHTML = `<strong>${ok ? "Good call." : "Careful."}</strong> ${text}`;
  }

  function decide(choice) {
    if (busy || state.finished) return;
    const item = current();
    const want = item.answer === "safe" ? "trust" : "report";
    const ok = choice === want;
    reviewed += 1;
    if (ok) correct += 1;
    busy = true;
    card.style.transition = "transform 280ms ease, opacity 280ms ease";
    const dir = choice === "trust" ? 1 : -1;
    card.style.transform = `translateX(${dir * 140}%) rotate(${dir * 12}deg)`;
    card.style.opacity = "0";
    flash(ok, item.clue);
    document.querySelector("#swipe-count").textContent = `${correct}/${reviewed} correct`;
    setTimeout(() => {
      index += 1;
      if (index >= deck.length) finish();
      else { render(); busy = false; }
    }, 300);
  }

  document.querySelector("#swipe-report").addEventListener("click", () => decide("report"));
  document.querySelector("#swipe-trust").addEventListener("click", () => decide("trust"));

  let startX = 0, dragging = false;
  card.addEventListener("pointerdown", (e) => {
    if (busy) return;
    dragging = true; startX = e.clientX;
    card.setPointerCapture(e.pointerId);
    card.style.transition = "none";
  });
  card.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    card.style.transform = `translateX(${dx}px) rotate(${dx / 22}deg)`;
    card.dataset.hint = dx > 40 ? "trust" : dx < -40 ? "report" : "";
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    if (dx > 90) decide("trust");
    else if (dx < -90) decide("report");
    else { card.style.transition = "transform 200ms ease"; card.style.transform = "translateX(0) rotate(0deg)"; card.dataset.hint = ""; }
  }
  card.addEventListener("pointerup", endDrag);
  card.addEventListener("pointercancel", endDrag);

  render();
  gameProgress.textContent = `${seconds}s left`;
  state.timer = setInterval(() => {
    seconds -= 1;
    if (timeEl) timeEl.textContent = seconds;
    gameProgress.textContent = `${seconds}s left`;
    if (seconds <= 0) finish();
  }, 1000);

  function finish() {
    if (state.finished) return;
    clearInterval(state.timer);
    completeGame("phishing");
    showResult("Nice sorting!", `You reviewed ${reviewed} messages and got ${correct} right. The real red flags: urgency, odd web links, and senders you don't recognize. When in doubt, report it instead of tapping.`);
  }
}

function startPassword() {
  gameKicker.textContent = "GAME 02";
  gameTitle.textContent = "The Weakest Link";
  gameProgress.textContent = "Build a password the hacker can't crack";
  gameArea.append(document.querySelector("#password-template").content.cloneNode(true));
  if (window.lucide) lucide.createIcons();

  const input = document.querySelector("#password-input");
  input.addEventListener("input", () => evaluatePassword(input.value));
  document.querySelector("#toggle-password").addEventListener("click", togglePassword);
  document.querySelector("#attack-password").addEventListener("click", () => runAttack(input.value));
  evaluatePassword("");
}

function passwordStats(value) {
  let pool = 0;
  if (/[a-z]/.test(value)) pool += 26;
  if (/[A-Z]/.test(value)) pool += 26;
  if (/\d/.test(value)) pool += 10;
  if (/[^A-Za-z0-9]/.test(value)) pool += 32;
  const guesses = Math.pow(pool || 1, value.length) / 2;
  const seconds = guesses / 1e10;
  return { pool, seconds };
}

function humanTime(seconds) {
  if (seconds < 1) return "instantly";
  const units = [["seconds", 60], ["minutes", 60], ["hours", 24], ["days", 365], ["years", 100], ["centuries", 100]];
  let value = seconds;
  for (const [name, size] of units) {
    if (value < size) return `about ${Math.max(1, Math.round(value)).toLocaleString()} ${name}`;
    value /= size;
  }
  return "millions of years";
}

function evaluatePassword(value) {
  const checks = {
    length: value.length >= 14,
    words: value.trim().split(/[\s_-]+/).filter(Boolean).length >= 3 || value.length >= 20,
    case: /[a-z]/.test(value) && /[A-Z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9\s]/.test(value)
  };
  const score = Object.values(checks).filter(Boolean).length;
  const labels = ["Type to begin", "Very weak", "Weak", "Okay", "Strong", "Very strong"];
  const colors = ["#ff765f", "#ff765f", "#ff9f5f", "#3fd8e6", "#72e6bd", "#72e6bd"];

  Object.entries(checks).forEach(([key, met]) => {
    const item = document.querySelector(`[data-check="${key}"]`);
    if (!item) return;
    item.classList.toggle("met", met);
    item.querySelector("svg").outerHTML = `<i data-lucide="${met ? "circle-check-big" : "circle"}"></i>`;
  });
  if (window.lucide) lucide.createIcons();
  document.querySelector("#strength-bar").style.width = `${score * 20}%`;
  document.querySelector("#strength-bar").style.background = colors[score];
  document.querySelector("#strength-label").textContent = labels[score];
  document.querySelector("#strength-score").textContent = `${score} / 5`;
  const stats = passwordStats(value);
  document.querySelector("#crack-time").textContent = value ? humanTime(stats.seconds) : "\u2014";
  document.querySelector("#attack-password").disabled = value.length === 0;
}

function runAttack(value) {
  const stats = passwordStats(value);
  const held = stats.seconds > 3.15e9;
  const stage = document.querySelector("#attack-stage");
  const meter = document.querySelector("#attack-meter span");
  const result = document.querySelector("#attack-result");
  stage.classList.remove("cracked", "held");
  result.textContent = "";
  meter.style.transition = "none";
  meter.style.width = "0%";
  document.querySelector("#attack-password").disabled = true;

  requestAnimationFrame(() => {
    meter.style.transition = `width ${held ? 2400 : 900}ms ${held ? "ease-out" : "ease-in"}`;
    meter.style.width = held ? "62%" : "100%";
  });

  clearTimeout(state.advanceTimer);
  state.advanceTimer = setTimeout(() => {
    if (held) {
      stage.classList.add("held");
      result.innerHTML = `<strong>Your password held.</strong> Even at ten billion guesses a second it would take ${humanTime(stats.seconds)}. That's a keeper.`;
      completeGame("password");
      showToast("Strong password \u2014 the hacker gave up.");
    } else {
      stage.classList.add("cracked");
      result.innerHTML = `<strong>Cracked in ${humanTime(stats.seconds)}.</strong> Make it longer and add a few unrelated words \u2014 length is what really slows an attacker down.`;
      document.querySelector("#attack-password").disabled = false;
    }
  }, held ? 2500 : 1000);
}

function togglePassword() {
  const input = document.querySelector("#password-input");
  const button = document.querySelector("#toggle-password");
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  button.setAttribute("aria-label", showing ? "Show password" : "Hide password");
  button.innerHTML = `<i data-lucide="${showing ? "eye" : "eye-off"}"></i>`;
  if (window.lucide) lucide.createIcons();
}

function startResponse() {
  gameKicker.textContent = "GAME 03";
  gameTitle.textContent = "Incident Rush";
  gameProgress.textContent = "0 / 4 ACTIONS";
  gameArea.append(document.querySelector("#response-template").content.cloneNode(true));
  if (window.lucide) lucide.createIcons();

  const shuffled = [...responseSteps].sort(() => Math.random() - 0.5);
  const options = document.querySelector("#response-options");
  shuffled.forEach((step, index) => {
    const button = document.createElement("button");
    button.className = "response-option";
    button.dataset.id = step.id;
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${step.text}</span>`;
    button.addEventListener("click", () => selectResponseStep(step, button));
    options.append(button);
  });
  renderSequence([]);
  document.querySelector("#reset-sequence").addEventListener("click", resetResponse);
  document.querySelector("#check-sequence").addEventListener("click", checkResponse);
}

let selectedSteps = [];

function selectResponseStep(step, button) {
  selectedSteps.push(step);
  button.disabled = true;
  renderSequence(selectedSteps);
  gameProgress.textContent = `${selectedSteps.length} / 4 ACTIONS`;
  document.querySelector("#check-sequence").disabled = selectedSteps.length !== responseSteps.length;
}

function renderSequence(steps) {
  const sequence = document.querySelector("#response-sequence");
  sequence.replaceChildren();
  for (let index = 0; index < 4; index += 1) {
    const slot = document.createElement("div");
    slot.className = `sequence-slot ${steps[index] ? "filled" : ""}`;
    slot.textContent = steps[index] ? `${index + 1}. ${steps[index].text}` : `Step ${index + 1}`;
    sequence.append(slot);
  }
}

function resetResponse() {
  selectedSteps = [];
  document.querySelectorAll(".response-option").forEach((button) => { button.disabled = false; });
  document.querySelector("#check-sequence").disabled = true;
  gameProgress.textContent = "0 / 4 ACTIONS";
  renderSequence([]);
}

function checkResponse() {
  const correct = selectedSteps.every((step, index) => step.id === responseSteps[index].id);
  if (!correct) {
    showToast("Close. Isolate the device first, then alert the response team.");
    resetResponse();
    return;
  }
  completeGame("response");
  showResult("Incident contained!", "Great calls. Unplug the device, report it, write down what happened, and let the security team take over \u2014 don't try to investigate it yourself.");
}

function completeGame(game) {
  state.finished = true;
  if (state.completed.includes(game)) return;
  state.completed.push(game);
  localStorage.setItem("cyberQuestCompleted", JSON.stringify(state.completed));
  markCompletedCards();
}

function showResult(title, message) {
  gameProgress.textContent = "COMPLETE";
  gameArea.innerHTML = `
    <div class="result-panel">
      <div class="result-content">
        <span class="result-icon"><i data-lucide="shield-check"></i></span>
        <h3>${title}</h3>
        <p>${message}</p>
        <button class="primary-button" id="continue-button"><i data-lucide="layout-grid"></i> Back to games</button>
      </div>
    </div>`;
  document.querySelector("#continue-button").addEventListener("click", showHome);
  if (window.lucide) lucide.createIcons();
}

function markCompletedCards() {
  document.querySelectorAll(".mission-card").forEach((card) => {
    card.classList.toggle("done", state.completed.includes(card.dataset.game));
  });
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function setupSignalCanvas() {
  const canvas = document.querySelector("#signal-canvas");
  const context = canvas.getContext("2d");
  if (!context || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const points = Array.from({ length: 28 }, () => ({ x: Math.random(), y: Math.random(), speed: 0.00004 + Math.random() * 0.00007 }));
  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    points.forEach((point, index) => {
      point.y -= point.speed;
      if (point.y < -0.05) point.y = 1.05;
      const x = point.x * window.innerWidth;
      const y = point.y * window.innerHeight;
      context.fillStyle = index % 3 === 0 ? "#3fd8e6" : "#72e6bd";
      context.fillRect(x, y, 2, 2);
      points.slice(index + 1).forEach((other) => {
        const otherX = other.x * window.innerWidth;
        const otherY = other.y * window.innerHeight;
        const distance = Math.hypot(x - otherX, y - otherY);
        if (distance < 125) {
          context.strokeStyle = `rgba(63,216,230,${(1 - distance / 125) * 0.16})`;
          context.beginPath(); context.moveTo(x, y); context.lineTo(otherX, otherY); context.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener("resize", resize);
  draw();
}

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function formatClock(total) {
  const safe = Math.max(0, total);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/* ===== Game 04: Spot the Spy ===== */
const spotObjects = [
  { risky: true, icon: "sticky-note", label: "Sticky note with a password", tip: "Never leave passwords written where others can see them." },
  { risky: true, icon: "laptop", label: "Unlocked laptop, nobody there", tip: "Lock your screen whenever you step away (Windows key + L)." },
  { risky: true, icon: "usb", label: "A USB stick someone left behind", tip: "Don't plug in USB drives you find \u2014 they can carry malware." },
  { risky: true, icon: "door-open", label: "Stranger slipping through a secure door", tip: "Don't let people follow you in without their own badge." },
  { risky: true, icon: "monitor", label: "Password typed on a visible screen", tip: "Keep passwords and private info off screens others can see." },
  { risky: true, icon: "files", label: "Confidential papers left on the printer", tip: "Collect printouts right away and lock away sensitive documents." },
  { risky: false, icon: "id-card", label: "Someone wearing their staff badge", tip: "" },
  { risky: false, icon: "lock", label: "A screen that is locked", tip: "" },
  { risky: false, icon: "trash-2", label: "Shredder for sensitive paper", tip: "" },
  { risky: false, icon: "clipboard-check", label: "Visitor sign-in sheet at reception", tip: "" }
];

function startSpot() {
  gameKicker.textContent = "GAME 04";
  gameTitle.textContent = "Spot the Spy";
  gameArea.append(document.querySelector("#spot-template").content.cloneNode(true));
  const objects = shuffle([...spotObjects]);
  const totalRisky = objects.filter((o) => o.risky).length;
  let found = 0;
  let seconds = 180;
  const grid = document.querySelector("#spot-grid");
  grid.replaceChildren();

  objects.forEach((obj) => {
    const tile = document.createElement("button");
    tile.className = "spot-tile";
    tile.innerHTML = `<span class="spot-ico"><i data-lucide="${obj.icon}"></i></span><span class="spot-label">${obj.label}</span>`;
    tile.addEventListener("click", () => {
      if (state.finished || tile.classList.contains("found") || tile.classList.contains("safe-flash")) return;
      if (obj.risky) {
        tile.classList.add("found");
        tile.insertAdjacentHTML("beforeend", `<span class="spot-tip">${obj.tip}</span>`);
        found += 1;
        updateCount();
        if (found === totalRisky) finish();
      } else {
        tile.classList.add("safe-flash");
        showToast("That one's fine \u2014 keep looking for the risky habits.");
        setTimeout(() => tile.classList.remove("safe-flash"), 600);
      }
    });
    grid.append(tile);
  });
  if (window.lucide) lucide.createIcons();

  function updateCount() {
    gameProgress.textContent = `Found ${found} / ${totalRisky}`;
    document.querySelector("#spot-count").textContent = `${found} / ${totalRisky} risks found`;
  }
  updateCount();

  const timerEl = document.querySelector("#spot-timer");
  timerEl.textContent = formatClock(seconds);
  state.timer = setInterval(() => {
    seconds -= 1;
    timerEl.textContent = formatClock(seconds);
    if (seconds <= 0) finish();
  }, 1000);

  function finish() {
    if (state.finished) return;
    clearInterval(state.timer);
    completeGame("spot");
    showResult(found === totalRisky ? "Great eye!" : "Time's up",
      `You spotted ${found} of ${totalRisky} security risks. Watch for unlocked screens, passwords on paper, strangers without badges, and USB sticks you didn't bring.`);
  }
}

/* ===== Game 05: Deepfake Detective ===== */
const deepfakeRounds = [
  { answer: "fake", caption: "New connection request", skin: "#e7b492", skinDark: "#c98f6d", hair: "#2a2730", hairStyle: "long", clothes: "#3a4b64", bg: ["#21506a", "#0e2a3c"], earrings: true, glasses: false, flaws: ["asymmetric-eyes", "mismatched-earrings"],
    tells: "The eyes are different sizes and sit at different heights, and there's an earring on only one ear \u2014 classic mistakes in AI-generated faces." },
  { answer: "real", caption: "New coworker", skin: "#d9a07a", skinDark: "#b97f5c", hair: "#1f1b22", hairStyle: "short", clothes: "#394a63", bg: ["#20566a", "#0f2f3f"], earrings: false, glasses: true, flaws: [],
    tells: "Matched eyes, even ears, tidy glasses, and a clean background. This looks like a genuine photo." },
  { answer: "fake", caption: "Job applicant", skin: "#f0c3a3", skinDark: "#cf9a78", hair: "#3a2a1e", hairStyle: "short", clothes: "#40506b", bg: ["#2a3f63", "#101f38"], earrings: false, glasses: true, flaws: ["warped-glasses", "melted-background"],
    tells: "The glasses frame is bent and uneven and the background melts into odd shapes \u2014 strong signs of an AI-generated image." },
  { answer: "fake", caption: "Dating profile", skin: "#c98a63", skinDark: "#a66a46", hair: "#141019", hairStyle: "bun", clothes: "#374862", bg: ["#1d4a5e", "#0c2634"], earrings: true, glasses: false, flaws: ["extra-teeth", "uneven-ears"],
    tells: "Look at the mouth \u2014 too many uneven teeth \u2014 and the ears sit at different heights. AI often gets teeth and ears wrong." },
  { answer: "real", caption: "Follower request", skin: "#e9b48f", skinDark: "#c88f68", hair: "#2c2230", hairStyle: "bun", clothes: "#3a4b64", bg: ["#235a6e", "#0f3040"], earrings: true, glasses: false, flaws: [],
    tells: "Matched earrings, even features, and a steady background \u2014 no artifacts. A real photo." },
  { answer: "real", caption: "Account photo", skin: "#cf9a76", skinDark: "#ad7854", hair: "#241d2b", hairStyle: "short", clothes: "#394a63", bg: ["#215063", "#0e2a3a"], earrings: false, glasses: false, flaws: [],
    tells: "Symmetrical features and a clean, consistent background. This one checks out as a real photo." }
];

function startDeepfake() {
  gameKicker.textContent = "GAME 05";
  gameTitle.textContent = "Deepfake Detective";
  gameArea.append(document.querySelector("#deepfake-template").content.cloneNode(true));
  if (window.lucide) lucide.createIcons();
  const rounds = shuffle([...deepfakeRounds]);
  let index = 0;
  let correct = 0;
  let seconds = 180;

  const channel = document.querySelector("#df-channel");
  const who = document.querySelector("#df-who");
  const photo = document.querySelector("#df-photo");
  const feedback = document.querySelector("#df-feedback");
  const buttons = document.querySelectorAll(".df-choice");

  function render() {
    const round = rounds[index];
    channel.textContent = "Profile photo";
    who.textContent = round.caption || "";
    photo.className = "df-photo";
    photo.innerHTML = portraitSVG(round);
    feedback.hidden = true;
    gameProgress.textContent = `Photo ${index + 1} / ${rounds.length}`;
    buttons.forEach((button) => { button.disabled = false; });
  }

  function answer(choice) {
    if (state.finished) return;
    const round = rounds[index];
    const ok = choice === round.answer;
    if (ok) correct += 1;
    photo.classList.add("revealed");
    feedback.hidden = false;
    feedback.className = `feedback-panel ${ok ? "correct" : "wrong"}`;
    feedback.innerHTML = `<strong>${ok ? "Correct." : (round.answer === "fake" ? "It was AI-generated." : "It was a real photo.")}</strong> ${round.tells}`;
    buttons.forEach((button) => { button.disabled = true; });
    clearTimeout(state.advanceTimer);
    state.advanceTimer = setTimeout(() => {
      index += 1;
      if (index >= rounds.length) finish();
      else render();
    }, 3600);
  }

  buttons.forEach((button) => button.addEventListener("click", () => answer(button.dataset.choice)));
  render();

  const timerEl = document.querySelector("#df-timer");
  timerEl.textContent = formatClock(seconds);
  state.timer = setInterval(() => {
    seconds -= 1;
    timerEl.textContent = formatClock(seconds);
    if (seconds <= 0) finish();
  }, 1000);

  function finish() {
    if (state.finished) return;
    clearInterval(state.timer);
    clearTimeout(state.advanceTimer);
    completeGame("deepfake");
    showResult("Sharp eye!", `You judged ${correct} of ${rounds.length} portraits correctly. AI can invent realistic faces \u2014 zoom in on the eyes, ears, teeth, glasses, jewelry, and background to catch the fakes.`);
  }
}

function portraitSVG(round) {
  const flaws = round.flaws || [];
  const has = (flaw) => flaws.includes(flaw);
  const uid = "p" + Math.random().toString(36).slice(2, 8);
  const skin = round.skin || "#e7b595";
  const skinDark = round.skinDark || "#c98f6d";
  const hair = round.hair || "#2a2730";
  const bg1 = round.bg ? round.bg[0] : "#21506a";
  const bg2 = round.bg ? round.bg[1] : "#0e2a3c";
  const clothes = round.clothes || "#394a63";

  const leftEye = { cx: 96, cy: 106, rx: 12, ry: 8 };
  const rightEye = { cx: 146, cy: 106, rx: 12, ry: 8 };
  if (has("asymmetric-eyes")) { rightEye.cy = 97; rightEye.rx = 15.5; rightEye.ry = 10.5; }

  const leftEar = { cx: 56, cy: 120, rx: 11, ry: 17 };
  const rightEar = { cx: 184, cy: 120, rx: 11, ry: 17 };
  if (has("uneven-ears")) { rightEar.cy = 138; rightEar.rx = 14; rightEar.ry = 22; }

  const glasses = round.glasses || has("warped-glasses");
  const markers = [];
  const mark = (x, y, text) => {
    const left = x > 140;
    markers.push(`<g class="pf-mark" transform="translate(${x},${y})"><circle r="15"/><text x="${left ? -20 : 20}" y="4" text-anchor="${left ? "end" : "start"}">${text}</text></g>`);
  };

  let bg = `<rect width="240" height="240" fill="url(#bg${uid})"/>`;
  if (has("melted-background")) {
    bg += `<g filter="url(#blur${uid})" opacity="0.85"><path d="M10 180 Q60 120 110 172 T230 150 L240 240 L0 240 Z" fill="${bg1}"/><circle cx="42" cy="58" r="30" fill="${bg2}"/></g>`;
    mark(42, 54, "Melted background");
  }

  const hairBack = round.hairStyle === "long" ? `<path d="M58 96 Q60 210 96 214 L144 214 Q180 210 182 96 Z" fill="${hair}"/>` : "";
  const shoulders = `<path d="M40 240 Q46 186 92 176 L148 176 Q194 186 200 240 Z" fill="${clothes}"/>`;
  const neck = `<rect x="104" y="150" width="32" height="40" rx="12" fill="${skinDark}"/>`;

  const ears = `<ellipse cx="${leftEar.cx}" cy="${leftEar.cy}" rx="${leftEar.rx}" ry="${leftEar.ry}" fill="${skinDark}"/><ellipse cx="${rightEar.cx}" cy="${rightEar.cy}" rx="${rightEar.rx}" ry="${rightEar.ry}" fill="${skinDark}"/>`;
  if (has("uneven-ears")) mark(rightEar.cx + 8, rightEar.cy, "Ears don't match");

  let earrings = "";
  if (round.earrings) {
    earrings += `<circle cx="${leftEar.cx}" cy="${leftEar.cy + leftEar.ry}" r="4" fill="#ffd666"/>`;
    if (has("mismatched-earrings")) mark(rightEar.cx + 8, rightEar.cy + rightEar.ry, "One earring");
    else earrings += `<circle cx="${rightEar.cx}" cy="${rightEar.cy + rightEar.ry}" r="4" fill="#ffd666"/>`;
  }

  const head = `<ellipse cx="120" cy="112" rx="62" ry="72" fill="url(#skin${uid})"/>`;

  let hairTop = "";
  if (round.hairStyle !== "bald") {
    if (round.hairStyle === "bun") hairTop = `<circle cx="120" cy="40" r="15" fill="${hair}"/><path d="M62 98 Q66 46 120 44 Q174 46 178 98 Q150 72 120 72 Q90 72 62 98 Z" fill="${hair}"/>`;
    else hairTop = `<path d="M60 100 Q58 40 120 38 Q182 40 180 100 Q168 74 120 74 Q72 74 60 100 Z" fill="${hair}"/>`;
  }
  if (has("blurry-hairline")) { hairTop = `<g filter="url(#blur${uid})">${hairTop}</g>`; mark(120, 52, "Fuzzy hairline"); }

  const brows = `<path d="M${leftEye.cx - 14} ${leftEye.cy - 16} q14 -8 26 0" stroke="${hair}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${rightEye.cx - 13} ${rightEye.cy - 16} q13 -8 26 0" stroke="${hair}" stroke-width="4" fill="none" stroke-linecap="round"/>`;

  const eyeWhite = (e) => `<ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx}" ry="${e.ry}" fill="#f7fbff"/>`;
  const pupil = (e) => `<circle cx="${e.cx}" cy="${e.cy}" r="${Math.min(e.ry, 5)}" fill="#3a2f2a"/>`;
  const eyes = eyeWhite(leftEye) + eyeWhite(rightEye) + pupil(leftEye) + pupil(rightEye);
  if (has("asymmetric-eyes")) mark(rightEye.cx, rightEye.cy, "Mismatched eyes");

  const nose = `<path d="M120 112 q-6 20 -2 26 q6 4 12 0" stroke="${skinDark}" stroke-width="3" fill="none" stroke-linecap="round"/>`;

  let mouth;
  if (has("extra-teeth")) {
    mouth = `<path d="M100 150 q20 10 40 0 q-4 16 -20 16 q-16 0 -20 -16 Z" fill="#7a3b3b"/><g fill="#fdfdfd">` +
      [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${101 + i * 6.3}" y="151" width="5.5" height="9" rx="1"/>`).join("") + `</g>`;
    mark(120, 168, "Odd teeth");
  } else {
    mouth = `<path d="M104 156 q16 12 32 0" stroke="#9c4b4b" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  }

  let glassesSvg = "";
  if (glasses) {
    const warp = has("warped-glasses");
    const rl = warp ? 19 : 16;
    const h = warp ? 30 : 24;
    const rot = warp ? 9 : 0;
    glassesSvg = `<g stroke="#1a2a38" stroke-width="3" fill="rgba(120,180,200,.14)">` +
      `<rect x="${leftEye.cx - 16}" y="${leftEye.cy - 12}" width="32" height="24" rx="8"/>` +
      `<g transform="rotate(${rot} ${rightEye.cx} ${rightEye.cy})"><rect x="${rightEye.cx - rl}" y="${rightEye.cy - h / 2}" width="${rl * 2}" height="${h}" rx="8"/></g>` +
      `<line x1="${leftEye.cx + 16}" y1="${leftEye.cy}" x2="${rightEye.cx - rl}" y2="${rightEye.cy}"/></g>`;
    if (warp) mark(rightEye.cx, rightEye.cy + 20, "Warped glasses");
  }

  const defs = `<defs><linearGradient id="bg${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient><radialGradient id="skin${uid}" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="${skin}"/><stop offset="1" stop-color="${skinDark}"/></radialGradient><filter id="blur${uid}"><feGaussianBlur stdDeviation="4"/></filter></defs>`;

  return `<svg viewBox="0 0 240 240" role="img" aria-label="Portrait to assess">${defs}${bg}${hairBack}${shoulders}${neck}${ears}${earrings}${head}${hairTop}${brows}${eyes}${nose}${mouth}${glassesSvg}<g class="pf-markers">${markers.join("")}</g></svg>`;
}

/* ===== Game 06: Micro-Escape Room ===== */
const escapePuzzles = [
  {
    title: "Lock 1 \u2014 Isolate the infected computer",
    prompt: "Security tools flagged one machine sending files at 3 AM to an unknown address overseas. Which one do you disconnect?",
    options: [
      { text: "Reception-PC \u2014 idle overnight, no activity", ok: false },
      { text: "Finance-Laptop \u2014 sending data at 3 AM to an unknown server", ok: true },
      { text: "Meeting-Room-TV \u2014 streamed a video at noon", ok: false },
      { text: "Your-Phone \u2014 normal email sync", ok: false }
    ],
    wrong: "Look for the odd behaviour \u2014 activity at 3 AM to an unknown address."
  },
  {
    title: "Lock 2 \u2014 Spot the booby-trapped file",
    prompt: "One attachment is a disguised program, not a document. Which file is dangerous?",
    options: [
      { text: "Quarterly-Report.pdf", ok: false },
      { text: "Team-Photo.jpg", ok: false },
      { text: "Invoice.pdf.exe", ok: true },
      { text: "Notes.txt", ok: false }
    ],
    wrong: "Check the real ending. A double ending like .pdf.exe means it's a program in disguise."
  },
  {
    title: "Lock 3 \u2014 Get out safely",
    prompt: "You've contained it. What's the right final move to open the door?",
    options: [
      { text: "Delete everything and tell no one", ok: false },
      { text: "Email the whole company a warning", ok: false },
      { text: "Report it to IT and let them take over", ok: true },
      { text: "Try to remove the malware yourself", ok: false }
    ],
    wrong: "Don't go it alone \u2014 the safe move is to report it and let the experts handle it."
  }
];

function startEscape() {
  gameKicker.textContent = "GAME 06";
  gameTitle.textContent = "Micro-Escape Room";
  gameArea.append(document.querySelector("#escape-template").content.cloneNode(true));
  if (window.lucide) lucide.createIcons();
  let step = 0;
  let seconds = 300;

  const title = document.querySelector("#escape-title");
  const prompt = document.querySelector("#escape-prompt");
  const options = document.querySelector("#escape-options");
  const locks = document.querySelectorAll(".escape-lock");

  function render() {
    const puzzle = escapePuzzles[step];
    title.textContent = puzzle.title;
    prompt.textContent = puzzle.prompt;
    gameProgress.textContent = `Lock ${step + 1} / ${escapePuzzles.length}`;
    locks.forEach((lock, i) => lock.classList.toggle("open", i < step));
    options.replaceChildren();
    shuffle([...puzzle.options]).forEach((opt) => {
      const button = document.createElement("button");
      button.className = "escape-option";
      button.textContent = opt.text;
      button.addEventListener("click", () => {
        if (state.finished) return;
        if (opt.ok) {
          button.classList.add("correct");
          step += 1;
          setTimeout(() => { if (step >= escapePuzzles.length) finish(); else render(); }, 500);
        } else {
          button.classList.add("wrong");
          showToast(puzzle.wrong);
          setTimeout(() => button.classList.remove("wrong"), 500);
        }
      });
      options.append(button);
    });
    if (window.lucide) lucide.createIcons();
  }
  render();

  const timerEl = document.querySelector("#escape-timer");
  timerEl.textContent = formatClock(seconds);
  state.timer = setInterval(() => {
    seconds -= 1;
    timerEl.textContent = formatClock(seconds);
    if (seconds <= 0) finish();
  }, 1000);

  function finish() {
    if (state.finished) return;
    clearInterval(state.timer);
    const win = step >= escapePuzzles.length;
    if (win) locks.forEach((lock) => lock.classList.add("open"));
    completeGame("escape");
    showResult(win ? "You're out!" : "Time's up", win
      ? "Nice work: you isolated the infected machine, caught the disguised file, and reported it the right way."
      : "The exit stayed locked this time. Remember: isolate the odd device, watch for disguised files, and always report to IT.");
  }
}

/* ===== Game 07: Security Crossword ===== */
const crosswordWords = [
  { num: 2, dir: "across", row: 2, col: 1, answer: "PASSWORD", clue: "The secret word that unlocks your account" },
  { num: 1, dir: "down", row: 1, col: 6, answer: "LOGIN", clue: "Signing in to an account" },
  { num: 2, dir: "down", row: 2, col: 1, answer: "PHISHING", clue: "Fake messages that try to trick you into clicking" },
  { num: 3, dir: "down", row: 2, col: 3, answer: "SCAM", clue: "A trick to steal your money or information" },
  { num: 4, dir: "down", row: 2, col: 5, answer: "WIFI", clue: "Wireless internet you should protect with a password" },
  { num: 5, dir: "down", row: 2, col: 8, answer: "DATA", clue: "Personal information worth protecting" }
];

function startCrossword() {
  gameKicker.textContent = "GAME 07";
  gameTitle.textContent = "Security Crossword";
  gameProgress.textContent = "Pick a clue, then type the word";
  gameArea.append(document.querySelector("#crossword-template").content.cloneNode(true));
  if (window.lucide) lucide.createIcons();

  const rows = 9;
  const cols = 8;
  const cells = {};
  const inputs = {};
  const words = crosswordWords.map((word) => {
    const list = [];
    for (let i = 0; i < word.answer.length; i += 1) {
      const r = word.dir === "down" ? word.row + i : word.row;
      const c = word.dir === "across" ? word.col + i : word.col;
      list.push({ r, c });
      const key = `${r}-${c}`;
      if (!cells[key]) cells[key] = { letter: word.answer[i], number: null };
    }
    const startKey = `${word.row}-${word.col}`;
    if (cells[startKey].number === null) cells[startKey].number = word.num;
    return { ...word, cells: list, li: null };
  });

  let active = null;
  let activeIdx = 0;
  let lastKey = "";

  const grid = document.querySelector("#crossword-grid");
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.replaceChildren();
  for (let r = 1; r <= rows; r += 1) {
    for (let c = 1; c <= cols; c += 1) {
      const key = `${r}-${c}`;
      const cell = cells[key];
      if (!cell) {
        const blank = document.createElement("div");
        blank.className = "xw-blank";
        grid.append(blank);
        continue;
      }
      const wrap = document.createElement("div");
      wrap.className = "xw-cell";
      if (cell.number) wrap.insertAdjacentHTML("beforeend", `<span class="xw-num">${cell.number}</span>`);
      const input = document.createElement("input");
      input.maxLength = 1;
      input.setAttribute("aria-label", `Row ${r} column ${c}`);
      input.setAttribute("autocapitalize", "characters");
      input.setAttribute("autocomplete", "off");
      input.spellcheck = false;
      input.dataset.answer = cell.letter;
      input.addEventListener("focus", () => onFocus(r, c));
      input.addEventListener("click", () => onClick(r, c));
      input.addEventListener("keydown", (event) => onKeyDown(event, r, c));
      input.addEventListener("input", () => onInput(input));
      wrap.append(input);
      inputs[key] = input;
      grid.append(wrap);
    }
  }

  function inputAt(cell) { return inputs[`${cell.r}-${cell.c}`]; }
  function wordsAt(r, c) { return words.filter((word) => word.cells.some((cell) => cell.r === r && cell.c === c)); }
  function indexInWord(word, r, c) { return word.cells.findIndex((cell) => cell.r === r && cell.c === c); }
  function pickWord(list, preferDir) {
    return list.find((word) => word.dir === preferDir) || list[0];
  }

  function highlight() {
    Object.values(inputs).forEach((input) => input.parentElement.classList.remove("active-word", "active-cell"));
    words.forEach((word) => { if (word.li) word.li.classList.remove("active"); });
    if (!active) return;
    active.cells.forEach((cell, i) => {
      const wrap = inputAt(cell).parentElement;
      wrap.classList.add("active-word");
      if (i === activeIdx) wrap.classList.add("active-cell");
    });
    if (active.li) active.li.classList.add("active");
  }

  function setActiveWord(word, idx) {
    active = word;
    activeIdx = Math.max(0, Math.min(idx || 0, word.cells.length - 1));
    highlight();
    const input = inputAt(active.cells[activeIdx]);
    input.focus({ preventScroll: true });
    input.select();
  }

  function moveTo(idx) {
    if (!active || idx < 0 || idx >= active.cells.length) return;
    activeIdx = idx;
    highlight();
    const input = inputAt(active.cells[idx]);
    input.focus({ preventScroll: true });
    input.select();
  }

  function onFocus(r, c) {
    if (active && indexInWord(active, r, c) !== -1) {
      activeIdx = indexInWord(active, r, c);
      highlight();
      return;
    }
    const here = wordsAt(r, c);
    if (here.length) {
      active = pickWord(here, "across");
      activeIdx = indexInWord(active, r, c);
      highlight();
    }
  }

  function onClick(r, c) {
    const key = `${r}-${c}`;
    const here = wordsAt(r, c);
    if (here.length > 1 && active && indexInWord(active, r, c) !== -1 && lastKey === key) {
      const other = here.find((word) => word !== active);
      if (other) setActiveWord(other, indexInWord(other, r, c));
    }
    lastKey = key;
  }

  function onInput(input) {
    input.value = input.value.toUpperCase().slice(0, 1);
    input.classList.remove("wrong");
    if (input.value && active && activeIdx < active.cells.length - 1) moveTo(activeIdx + 1);
  }

  function onKeyDown(event, r, c) {
    const key = event.key;
    if (key === "Backspace") {
      const input = inputs[`${r}-${c}`];
      if (input.value) {
        input.value = "";
        event.preventDefault();
      } else if (active && activeIdx > 0) {
        event.preventDefault();
        const prevIdx = activeIdx - 1;
        moveTo(prevIdx);
        inputAt(active.cells[prevIdx]).value = "";
      }
    } else if (key === "ArrowRight") { event.preventDefault(); focusDelta(r, c, 0, 1); }
    else if (key === "ArrowLeft") { event.preventDefault(); focusDelta(r, c, 0, -1); }
    else if (key === "ArrowDown") { event.preventDefault(); focusDelta(r, c, 1, 0); }
    else if (key === "ArrowUp") { event.preventDefault(); focusDelta(r, c, -1, 0); }
  }

  function focusDelta(r, c, dr, dc) {
    let nr = r + dr;
    let nc = c + dc;
    while (nr >= 1 && nr <= rows && nc >= 1 && nc <= cols) {
      const input = inputs[`${nr}-${nc}`];
      if (input) { input.focus({ preventScroll: true }); input.select(); return; }
      nr += dr;
      nc += dc;
    }
  }

  function renderClues(dir, container) {
    container.replaceChildren();
    words.filter((word) => word.dir === dir).sort((a, b) => a.num - b.num).forEach((word) => {
      const li = document.createElement("li");
      li.className = "xw-clue";
      li.tabIndex = 0;
      li.innerHTML = `<strong>${word.num}.</strong> ${word.clue} <span>(${word.answer.length})</span>`;
      const activate = () => setActiveWord(word, 0);
      li.addEventListener("click", activate);
      li.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); }
      });
      word.li = li;
      container.append(li);
    });
  }
  renderClues("across", document.querySelector("#xw-across"));
  renderClues("down", document.querySelector("#xw-down"));

  document.querySelector("#xw-check").addEventListener("click", () => {
    let allCorrect = true;
    Object.values(inputs).forEach((input) => {
      const ok = (input.value || "").toUpperCase() === input.dataset.answer;
      input.classList.toggle("wrong", !ok && input.value !== "");
      if (!ok) allCorrect = false;
    });
    if (allCorrect) {
      completeGame("crossword");
      showResult("Puzzle solved!", "Nice work. These words are the building blocks of staying safe: strong passwords, spotting phishing and scams, and protecting your Wi-Fi and data.");
    } else {
      showToast("Not quite yet \u2014 the letters in red need another look.");
    }
  });

  document.querySelector("#xw-reveal").addEventListener("click", () => {
    Object.values(inputs).forEach((input) => {
      input.value = input.dataset.answer;
      input.classList.remove("wrong");
    });
  });

  setActiveWord(words[0], 0);
}

/* ===== Game 08: Sort It Out (data classification) ===== */
const dataItems = [
  { label: "Company press release", bin: "public" },
  { label: "The office lunch menu", bin: "public" },
  { label: "A published blog post", bin: "public" },
  { label: "Your company's public website", bin: "public" },
  { label: "A customer's credit card number", bin: "private" },
  { label: "An employee's home address", bin: "private" },
  { label: "A login one-time code", bin: "private" },
  { label: "The internal salary spreadsheet", bin: "private" }
];

function startDataDefender() {
  gameKicker.textContent = "GAME 08";
  gameTitle.textContent = "Sort It Out";
  gameArea.append(document.querySelector("#data-template").content.cloneNode(true));
  if (window.lucide) lucide.createIcons();

  const items = shuffle([...dataItems]);
  const total = items.length;
  const tray = document.querySelector("#data-tray");
  const dropPublic = document.querySelector("#bin-public .bin-drop");
  const dropPrivate = document.querySelector("#bin-private .bin-drop");
  const checkBtn = document.querySelector("#data-check");
  let selected = null;

  function updateProgress() {
    const placed = total - tray.querySelectorAll(".data-chip").length;
    gameProgress.textContent = `Sorted ${placed} / ${total}`;
    checkBtn.disabled = placed !== total;
  }

  function select(chip) {
    if (selected) selected.classList.remove("selected");
    selected = selected === chip ? null : chip;
    if (selected) selected.classList.add("selected");
  }

  function moveTo(container) {
    if (!selected) return;
    selected.classList.remove("selected", "correct", "wrong");
    container.append(selected);
    selected = null;
    updateProgress();
  }

  items.forEach((item) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "data-chip";
    chip.textContent = item.label;
    chip.dataset.bin = item.bin;
    chip.addEventListener("click", (event) => { event.stopPropagation(); select(chip); });
    tray.append(chip);
  });

  document.querySelector("#bin-public").addEventListener("click", () => moveTo(dropPublic));
  document.querySelector("#bin-private").addEventListener("click", () => moveTo(dropPrivate));
  tray.addEventListener("click", () => moveTo(tray));

  checkBtn.addEventListener("click", () => {
    let allCorrect = true;
    [[dropPublic, "public"], [dropPrivate, "private"]].forEach(([drop, want]) => {
      drop.querySelectorAll(".data-chip").forEach((chip) => {
        const ok = chip.dataset.bin === want;
        chip.classList.toggle("correct", ok);
        chip.classList.toggle("wrong", !ok);
        if (!ok) allCorrect = false;
      });
    });
    if (allCorrect) {
      completeGame("data");
      showResult("Sorted!", "Nice work. When in doubt, keep it private \u2014 especially anything that identifies a person, any password or code, or internal company details.");
    } else {
      showToast("Some are misplaced \u2014 the red ones belong in the other box.");
    }
  });

  updateProgress();
}

/* ===== Game 09: Security Match (memory pairs) ===== */
const matchPairs = [
  { risk: "Phishing email", fix: "Don't click \u2014 report it" },
  { risk: "Weak password", fix: "Use a long passphrase" },
  { risk: "Public Wi-Fi", fix: "Don't open sensitive accounts" },
  { risk: "A USB stick you found", fix: "Don't plug it in" },
  { risk: "Software update ready", fix: "Install it promptly" },
  { risk: "Lost work laptop", fix: "Report it right away" }
];

function startMatch() {
  gameKicker.textContent = "GAME 09";
  gameTitle.textContent = "Security Match";
  gameProgress.textContent = `0 / ${matchPairs.length} pairs`;
  gameArea.append(document.querySelector("#match-template").content.cloneNode(true));
  if (window.lucide) lucide.createIcons();

  const cards = [];
  matchPairs.forEach((pair, i) => {
    cards.push({ pair: i, text: pair.risk });
    cards.push({ pair: i, text: pair.fix });
  });
  shuffle(cards);

  const board = document.querySelector("#match-board");
  board.replaceChildren();
  let first = null;
  let lock = false;
  let matched = 0;
  let moves = 0;

  cards.forEach((card) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "match-card";
    button.innerHTML = `<span class="match-face match-back">?</span><span class="match-face match-front">${card.text}</span>`;
    button.addEventListener("click", () => flip(button, card));
    board.append(button);
  });

  function flip(button, card) {
    if (lock || state.finished) return;
    if (button.classList.contains("flipped") || button.classList.contains("matched")) return;
    button.classList.add("flipped");
    if (!first) { first = { button, card }; return; }
    moves += 1;
    if (card.pair === first.card.pair && button !== first.button) {
      first.button.classList.add("matched");
      button.classList.add("matched");
      matched += 1;
      gameProgress.textContent = `${matched} / ${matchPairs.length} pairs`;
      first = null;
      if (matched === matchPairs.length) finish();
    } else {
      lock = true;
      const prev = first;
      first = null;
      clearTimeout(state.advanceTimer);
      state.advanceTimer = setTimeout(() => {
        prev.button.classList.remove("flipped");
        button.classList.remove("flipped");
        lock = false;
      }, 900);
    }
  }

  function finish() {
    completeGame("match");
    showResult("All matched!", `You paired every risk with the right response in ${moves} tries. Spotting a risk is step one \u2014 knowing the safe response is what keeps you protected.`);
  }
}