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
  },
  {
    type: "Email", name: "Microsoft 365", email: "no-reply@micros0ft-security.com", time: "7:41 AM",
    subject: "Unusual sign-in blocked \u2014 verify now",
    body: "We stopped a sign-in from Belarus. Verify your identity within 24 hours or your account will be locked.",
    link: "micros0ft-security.com/verify", answer: "phish",
    clue: "Look closely: Microsoft is spelled with a zero. Real security alerts don't send you to an outside address."
  },
  {
    type: "Email", name: "HR Team", email: "hr@yourcompany.com", time: "9:30 AM",
    subject: "Open enrolment closes Friday",
    body: "A reminder that benefits enrolment closes Friday. Sign in to the HR portal from the intranet home page when you have a moment.",
    link: "", answer: "safe",
    clue: "It's a routine reminder from your own HR address and tells you to go through the intranet yourself rather than clicking a link."
  },
  {
    type: "Text", name: "Delivery", email: "+44 7700 900231", time: "6:12 PM",
    subject: "",
    body: "Your parcel could not be delivered. Pay the \u00a31.45 redelivery fee here: royalmai1-redeliver.com",
    link: "royalmai1-redeliver.com", answer: "phish",
    clue: "A tiny fee is bait to capture your card details, and the address uses a 1 instead of an l. Track parcels in the official app."
  },
  {
    type: "Email", name: "Priya Raman", email: "priya.raman@yourcompany.com", time: "11:05 AM",
    subject: "Slides for tomorrow",
    body: "Here are the slides you asked for yesterday. I left comments on slide 4 \u2014 shout if anything looks off.",
    link: "yourcompany.sharepoint.com/sites/marketing", answer: "safe",
    clue: "It continues a conversation you started, comes from an internal address, and links to your usual work site."
  },
  {
    type: "Email", name: "IT Helpdesk", email: "helpdesk@yourcompany-it.net", time: "2:02 PM",
    subject: "Action required: re-enter your password",
    body: "We are migrating mailboxes tonight. Reply to this message with your username and password so we can move your account.",
    link: "", answer: "phish",
    clue: "No IT team will ever ask for your password \u2014 by email, phone, or chat. The domain is also not your company's."
  },
  {
    type: "Chat", name: "Sam from Finance", email: "Microsoft Teams", time: "10:48 AM",
    subject: "",
    body: "New supplier bank details attached \u2014 please update the payment before close of business and don't mention it to anyone yet.",
    link: "", answer: "phish",
    clue: "Changing bank details plus urgency plus secrecy is the classic invoice-fraud pattern. Verify by phone on a known number."
  },
  {
    type: "Email", name: "Building Reception", email: "reception@yourcompany.com", time: "8:20 AM",
    subject: "Lift maintenance on Tuesday",
    body: "Lift B will be out of service on Tuesday morning. Please use Lift A or the stairs. Sorry for the inconvenience.",
    link: "", answer: "safe",
    clue: "Pure information from an internal address \u2014 nothing to click, nothing to hand over."
  },
  {
    type: "Text", name: "Unknown", email: "+1 (202) 555-0188", time: "9:58 PM",
    subject: "",
    body: "Hi, is this still your number? I'm Emma \u2014 we met at the conference. I have an investment tip you'll love.",
    link: "", answer: "phish",
    clue: "A stranger who 'remembers' you and pivots to money is running a long-con scam. Don't reply \u2014 replying confirms the number is live."
  },
  {
    type: "Email", name: "Adobe", email: "message@adobe-invoices.info", time: "3:15 PM",
    subject: "Invoice #40219 \u2014 payment overdue",
    body: "Your subscription payment failed. Open the attached invoice and confirm your card to avoid losing access.",
    link: "adobe-invoices.info/pay", answer: "phish",
    clue: "An unexpected invoice from a look-alike address, with pressure to enter a card. Check subscriptions in the real app instead."
  },
  {
    type: "Email", name: "Security Team", email: "security@yourcompany.com", time: "1:00 PM",
    subject: "Reminder: phishing simulation this month",
    body: "During October we'll be running awareness exercises. If something looks odd, use the Report button in Outlook \u2014 that's all we ask.",
    link: "", answer: "safe",
    clue: "Internal address, no link, no credentials requested, and it points you at a built-in button rather than a web page."
  },
  {
    type: "Chat", name: "IT Support", email: "WhatsApp", time: "7:05 PM",
    subject: "",
    body: "Hi, IT here. We're fixing your laptop remotely \u2014 please read out the 6-digit code we just texted you.",
    link: "", answer: "phish",
    clue: "A one-time code is the last step of someone logging in as you. Nobody legitimate will ever ask you to read one out."
  },
  {
    type: "Email", name: "Learning Team", email: "learning@yourcompany.com", time: "10:15 AM",
    subject: "Your annual training is due",
    body: "Your compliance module is due by the 31st. You can find it under 'My Learning' after signing in to the intranet.",
    link: "", answer: "safe",
    clue: "Expected, internal, and it asks you to navigate there yourself instead of clicking through."
  },
  {
    type: "Text", name: "Bank Security", email: "+1 (888) 555-0143", time: "11:52 AM",
    subject: "",
    body: "Fraud detected. Move your money to a safe account now. Call 0800-555-0143 and have your card and PIN ready.",
    link: "", answer: "phish",
    clue: "No bank has a 'safe account', and no bank asks for your PIN. Hang up and call the number printed on your card."
  },
  {
    type: "Email", name: "Jon Okafor", email: "j.okafor@yourcompany.com", time: "4:40 PM",
    subject: "Re: desk move on Monday",
    body: "Confirmed \u2014 you're on the third floor by the window from Monday. Facilities will move your monitor over the weekend.",
    link: "", answer: "safe",
    clue: "A reply in a thread you already know about, from a colleague's real address, asking nothing of you."
  },
  {
    type: "Email", name: "Google Drive", email: "share-noreply@drive-google-docs.com", time: "6:30 AM",
    subject: "Someone shared 'Bonus_2026.xlsx' with you",
    body: "A document has been shared with you. Sign in with your work email to view it before access expires.",
    link: "drive-google-docs.com/open", answer: "phish",
    clue: "Juicy filename, fake domain, and a sign-in page designed to harvest your work password. Real Drive links use drive.google.com."
  }
];

const responseScenarios = [
  {
    id: "malware",
    headline: "A laptop might be hacked",
    brief: "A coworker says pop-ups keep appearing and the mouse is moving on its own. Put the first four actions in the right order.",
    steps: [
      { id: 1, text: "Unplug it from the internet (Wi-Fi and cables)" },
      { id: 2, text: "Call IT or the security team" },
      { id: 3, text: "Write down what happened and when" },
      { id: 4, text: "Do what the security team tells you" }
    ],
    hint: "Stop the spread first, then raise the alarm.",
    done: "Great calls. Unplug the device, report it, write down what happened, and let the security team take over \u2014 don't try to investigate it yourself."
  },
  {
    id: "clicked-link",
    headline: "You clicked a fake link",
    brief: "You clicked a link in an email and typed your password before realising it was fake. Put the first four actions in the right order.",
    steps: [
      { id: 1, text: "Change that password straight away" },
      { id: 2, text: "Report the email to IT" },
      { id: 3, text: "Check your account for anything you didn't do" },
      { id: 4, text: "Change the same password anywhere else you used it" }
    ],
    hint: "The stolen password is the live danger \u2014 change it before anything else.",
    done: "Exactly right. Change the password first, report it so IT can look for others who clicked, check for activity that isn't yours, and replace that password anywhere it was reused."
  },
  {
    id: "lost-phone",
    headline: "Your work phone is missing",
    brief: "Your work phone goes missing on the train home. Put the first four actions in the right order.",
    steps: [
      { id: 1, text: "Report it to IT and your manager" },
      { id: 2, text: "Ask IT to wipe and lock the device" },
      { id: 3, text: "Change the passwords for apps on that phone" },
      { id: 4, text: "Watch for odd messages sent from your accounts" }
    ],
    hint: "Someone else may already be holding it \u2014 tell the people who can lock it down.",
    done: "Spot on. Report it immediately so IT can wipe the device remotely, then change the passwords it held and keep an eye out for messages you didn't send."
  },
  {
    id: "wrong-recipient",
    headline: "An email went to the wrong person",
    brief: "You emailed a spreadsheet of customer details to the wrong person outside the company. Put the first four actions in the right order.",
    steps: [
      { id: 1, text: "Try to recall the message" },
      { id: 2, text: "Tell IT and your manager what was sent" },
      { id: 3, text: "Ask the recipient to delete it" },
      { id: 4, text: "Help record what information was involved" }
    ],
    hint: "Recall it if you can, but tell someone either way \u2014 don't try to quietly fix it.",
    done: "Well handled. Recall it if you can, but report it regardless: there are legal deadlines for data breaches, and hiding a mistake always makes it worse."
  }
];

let responseScenario = responseScenarios[0];
let responseSteps = responseScenario.steps;

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

  const messageId = (message) => message.body.slice(0, 32);
  const deck = shuffle([
    ...pickFresh("phish-bad", phishingMessages.filter((m) => m.answer === "phish"), 5, messageId),
    ...pickFresh("phish-safe", phishingMessages.filter((m) => m.answer === "safe"), 3, messageId)
  ]);
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

  [responseScenario] = pickFresh("response", responseScenarios, 1, (item) => item.id);
  responseSteps = responseScenario.steps;
  selectedSteps = [];
  document.querySelector("#response-headline").textContent = responseScenario.headline;
  document.querySelector("#response-brief").textContent = responseScenario.brief;

  const shuffled = shuffle([...responseSteps]);
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
    showToast(responseScenario.hint);
    resetResponse();
    return;
  }
  completeGame("response");
  showResult("Incident contained!", responseScenario.done);
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

const SEEN_KEY = "cyberQuestSeen";
const seenItems = JSON.parse(localStorage.getItem(SEEN_KEY) || "{}");

function itemId(item) {
  return item.id || item.label || item.text || item.risk || item.subject || item.title || JSON.stringify(item);
}

// Draws `count` items the player hasn't had yet; once a pool runs out it starts a
// fresh cycle, still avoiding whatever came up in the previous round.
function pickFresh(key, pool, count, idOf = itemId) {
  let used = seenItems[key] || [];
  let fresh = pool.filter((item) => !used.includes(idOf(item)));
  if (fresh.length < count) {
    const recent = used.slice(-count);
    fresh = pool.filter((item) => !recent.includes(idOf(item)));
    if (fresh.length < count) fresh = [...pool];
    used = [];
  }
  const picked = shuffle([...fresh]).slice(0, count);
  seenItems[key] = [...used, ...picked.map(idOf)];
  localStorage.setItem(SEEN_KEY, JSON.stringify(seenItems));
  return picked;
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
  { risky: true, icon: "key", label: "Office key left in the door", tip: "Keys and badges belong on you, not in a lock or a drawer." },
  { risky: true, icon: "trash", label: "Client list dropped in the normal bin", tip: "Anything with names or account details goes in the shredder." },
  { risky: true, icon: "smartphone", label: "Work phone left on the café table", tip: "An unattended device is an unlocked door. Take it with you." },
  { risky: true, icon: "wifi", label: "Free Wi-Fi called 'Airport_Guest_Free'", tip: "Open networks can be fake. Use your phone's hotspot instead." },
  { risky: true, icon: "user-round", label: "Visitor wandering without an escort", tip: "Guests should be badged and escorted. Offer to walk them back." },
  { risky: true, icon: "credit-card", label: "Card details read aloud on a call", tip: "Never say card numbers, codes, or passwords out loud in an open space." },
  { risky: true, icon: "mail-open", label: "Payslips left in an open pigeonhole", tip: "Personal paperwork needs a locked drawer, not a shared tray." },
  { risky: true, icon: "camera", label: "Whiteboard of plans in a photo", tip: "Check what's in the background before you take or share a photo." },
  { risky: false, icon: "id-card", label: "Someone wearing their staff badge", tip: "" },
  { risky: false, icon: "lock", label: "A screen that is locked", tip: "" },
  { risky: false, icon: "trash-2", label: "Shredder for sensitive paper", tip: "" },
  { risky: false, icon: "clipboard-check", label: "Visitor sign-in sheet at reception", tip: "" },
  { risky: false, icon: "shield-check", label: "Laptop showing an update reminder", tip: "" },
  { risky: false, icon: "archive", label: "Filing cabinet that's locked", tip: "" },
  { risky: false, icon: "coffee", label: "Colleague taking their badge to lunch", tip: "" },
  { risky: false, icon: "eye-off", label: "Privacy screen on a train laptop", tip: "" },
  { risky: false, icon: "phone-call", label: "Someone verifying a caller before helping", tip: "" },
  { risky: false, icon: "printer", label: "Printer that needs a badge to release jobs", tip: "" }
];

function startSpot() {
  gameKicker.textContent = "GAME 04";
  gameTitle.textContent = "Spot the Spy";
  gameArea.append(document.querySelector("#spot-template").content.cloneNode(true));
  const objects = shuffle([
    ...pickFresh("spot-risky", spotObjects.filter((o) => o.risky), 6),
    ...pickFresh("spot-safe", spotObjects.filter((o) => !o.risky), 4)
  ]);
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
/* Each topic has a real photo and an AI-generated version of the same scene, plus an
   annotated side-by-side used as the reveal. northernLights has no real counterpart. */
const deepfakeTopics = [
  {
    caption: "Wildlife photo post",
    alt: "Blue and black poison dart frog on a mossy rock",
    ai: "AI/frog_1-1024x576.jpg",
    real: "AI/frog_2-1024x576.jpg",
    analysis: "AI/frog_analysis-1024x576.png",
    aiTells: "The markings are simple, evenly round blobs and the legs melt into the body. AI tends to invent tidy, repeating patterns.",
    realTells: "The pattern is complex and irregular \u2014 speckles of different sizes, crisp toes, real skin texture. That messiness is a sign of a genuine photo."
  },
  {
    caption: "School newsletter photo",
    alt: "Children painting together at a table",
    ai: "AI/kids_doing_art_1-1024x576.jpg",
    real: "AI/kids_doing_art_2-1024x576.jpg",
    analysis: "AI/kids_doing_art_analysis-1024x576.png",
    aiTells: "Count the hands. Some arms don't connect to anyone and a hand appears where no child is standing. Hands are still the number one AI giveaway.",
    realTells: "Every hand lines up with an arm and an owner, and the kids' attention follows what they're actually doing."
  },
  {
    caption: "Space launch, shared on social",
    alt: "Space shuttle lifting off through clouds",
    ai: "AI/launch_1-1024x576.jpg",
    real: "AI/launch_2-1024x576.jpg",
    analysis: "AI/launch_analysis-1024x576.png",
    aiTells: "The shuttle is a vague, simplified shape \u2014 no panels, markings, or hardware. AI blurs detail on anything small or far away.",
    realTells: "The orbiter shows real structure: panels, markings, and boosters in the right places, with smoke that matches the engines."
  },
  {
    caption: "Travel blog header",
    alt: "Mount Fuji behind a lake framed by autumn maple leaves",
    ai: "AI/MtFuji_1-1024x576.jpg",
    real: "AI/MtFuji_2-1024x576.jpg",
    analysis: "AI/MtFuji_analysis-1024x576.png",
    aiTells: "The maple leaves are mushy shapes rather than real leaves, and the far shoreline doesn't match the real place \u2014 buildings dissolve into blur.",
    realTells: "Individual leaves have stems and sharp edges, and the far bank has real buildings that line up with their reflections."
  },
  {
    caption: "History page photo",
    alt: "The ocean liner Titanic at sea",
    ai: "AI/titantic_1-1024x576.jpg",
    real: "AI/titantic_2-1024x576.png",
    analysis: "AI/titantic_analysis-1024x576.png",
    aiTells: "The masts and funnels are the wrong number, size, and spacing, and the light on the hull doesn't match the sunset behind it.",
    realTells: "Four funnels with the correct rake and spacing, consistent lighting, and period film grain \u2014 it matches the historical record."
  },
  {
    caption: "Aurora photo from a friend",
    alt: "Green and purple northern lights over snowy mountains",
    ai: "AI/northern_lights_1-1024x576.jpg",
    real: null,
    analysis: "AI/northern_lights_analysis-1024x576.png",
    aiTells: "The aurora has a crumpled, fabric-like texture instead of smooth curtains of light, and the reflection in the water shows colours that aren't in the sky.",
    realTells: ""
  }
];

function buildDeepfakeRounds() {
  const makeRound = (topic, answer) => ({
    answer,
    caption: topic.caption,
    alt: topic.alt,
    src: answer === "fake" ? topic.ai : topic.real,
    analysis: topic.analysis,
    tells: answer === "fake" ? topic.aiTells : topic.realTells
  });
  // Rotate which half of each pair you get, so a replay shows the other version.
  const pairs = deepfakeTopics.filter((topic) => topic.real);
  const asFake = pickFresh("deepfake-variant", pairs, 2, (topic) => topic.caption);
  const rounds = pairs.map((topic) => makeRound(topic, asFake.includes(topic) ? "fake" : "real"));
  deepfakeTopics.filter((topic) => !topic.real).forEach((topic) => rounds.push(makeRound(topic, "fake")));
  return shuffle(rounds);
}

function startDeepfake() {
  gameKicker.textContent = "GAME 05";
  gameTitle.textContent = "Deepfake Detective";
  gameArea.append(document.querySelector("#deepfake-template").content.cloneNode(true));
  if (window.lucide) lucide.createIcons();
  const rounds = buildDeepfakeRounds();
  rounds.forEach((round) => { new Image().src = round.src; new Image().src = round.analysis; });
  let index = 0;
  let correct = 0;

  const channel = document.querySelector("#df-channel");
  const who = document.querySelector("#df-who");
  const photo = document.querySelector("#df-photo");
  const prompt = document.querySelector("#df-prompt");
  const feedback = document.querySelector("#df-feedback");
  const choices = document.querySelector("#df-choices");
  const nextButton = document.querySelector("#df-next");
  const nextLabel = document.querySelector("#df-next-label");
  const buttons = document.querySelectorAll(".df-choice");

  function render() {
    const round = rounds[index];
    channel.textContent = "Shared image";
    who.textContent = round.caption || "";
    photo.className = "df-photo";
    photo.innerHTML = `<img src="${round.src}" alt="${round.alt}">`;
    prompt.hidden = false;
    feedback.hidden = true;
    choices.hidden = false;
    nextButton.hidden = true;
    gameProgress.textContent = `Photo ${index + 1} / ${rounds.length}`;
    buttons.forEach((button) => { button.disabled = false; });
  }

  function answer(choice) {
    if (state.finished) return;
    const round = rounds[index];
    const ok = choice === round.answer;
    if (ok) correct += 1;
    photo.className = "df-photo revealed";
    photo.innerHTML = `<img src="${round.analysis}" alt="Side-by-side comparison of the AI-generated and real version of this scene">`;
    prompt.hidden = true;
    feedback.hidden = false;
    feedback.className = `feedback-panel ${ok ? "correct" : "wrong"}`;
    feedback.innerHTML = `<strong>${ok ? "Correct." : (round.answer === "fake" ? "It was AI-generated." : "It was a real photo.")}</strong> ${round.tells}`;
    choices.hidden = true;
    nextButton.hidden = false;
    nextLabel.textContent = index + 1 >= rounds.length ? "See results" : "Next photo";
    nextButton.focus();
  }

  buttons.forEach((button) => button.addEventListener("click", () => answer(button.dataset.choice)));
  nextButton.addEventListener("click", () => {
    index += 1;
    if (index >= rounds.length) finish();
    else render();
  });
  render();

  function finish() {
    if (state.finished) return;
    completeGame("deepfake");
    showResult("Sharp eye!", `You judged ${correct} of ${rounds.length} images correctly. AI images fall apart in the details \u2014 zoom in on hands, patterns, text, small objects, and reflections before you trust or share a picture.`);
  }
}

/* ===== Game 06: Micro-Escape Room ===== */
const escapePuzzles = [
  {
    title: "Isolate the infected computer",
    prompt: "Security tools flagged one machine sending files at 3 AM to an unknown address overseas. Which one do you disconnect?",
    options: [
      { text: "Reception-PC \u2014 idle overnight, no activity", ok: false, why: "This one did nothing all night. A quiet machine isn't the one leaking files \u2014 unplugging it just takes a working computer offline." },
      { text: "Finance-Laptop \u2014 sending data at 3 AM to an unknown server", ok: true, why: "Nobody in finance is working at 3 AM, and company files should never travel to an address nobody recognises. Those two things together say \u201cthis machine is being controlled by someone else\u201d. Disconnecting it from the network stops the files leaving while everything else keeps running." },
      { text: "Meeting-Room-TV \u2014 streamed a video at noon", ok: false, why: "Streaming a video at lunchtime is exactly what a meeting-room TV is for. Normal activity at a normal hour isn't a red flag." },
      { text: "Your-Phone \u2014 normal email sync", ok: false, why: "Phones check email all day \u2014 that's routine. The clue you want is unusual activity at an unusual time going somewhere unknown." }
    ],
    why: "The giveaway was the combination: an odd hour, and data going to a server nobody recognises. Pulling that one machine off the network cuts the attacker's connection without disrupting the rest of the office."
  },
  {
    title: "Spot the dangerous file",
    prompt: "One attachment is a disguised program, not a document. Which file is dangerous?",
    options: [
      { text: "Quarterly-Report.pdf", ok: false, why: "A single ending of .pdf means it opens in a PDF reader as a document. It can't run on its own." },
      { text: "Team-Photo.jpg", ok: false, why: "A .jpg is just a picture. It opens in a photo viewer and doesn't install anything." },
      { text: "Invoice.pdf.exe", ok: true, why: "Only the LAST part of a file name decides what it does, and .exe means \u201cprogram\u201d \u2014 double-click it and it runs. The \u201c.pdf\u201d in the middle is fake, put there so your eye reads \u201cinvoice PDF\u201d and clicks without thinking. Two endings in one name is almost always a trap." },
      { text: "Notes.txt", ok: false, why: "A .txt is plain text \u2014 about the safest thing you can be sent. It opens in Notepad and nothing else." }
    ],
    why: "Always read a file name right to left. The final ending is what actually runs, so a name like Invoice.pdf.exe is a program wearing a document costume. On a work device, don't open it \u2014 report it."
  },
  {
    title: "Get out safely",
    prompt: "You've contained it. What's the right final move to open the door?",
    options: [
      { text: "Delete everything and tell no one", ok: false, why: "Deleting the evidence makes it impossible to find out how the attacker got in \u2014 so they'll simply walk back in the same way. Staying quiet also leaves everyone else unprotected." },
      { text: "Email the whole company a warning", ok: false, why: "Well-meant, but it causes panic, and attackers who are still inside the mailbox get to read your warning too. Let IT send the official message." },
      { text: "Report it to IT and let them take over", ok: true, why: "IT has the tools and the authority to check whether anything else is affected, preserve the evidence, and clean up properly. Your job is to raise the alarm quickly \u2014 reporting early is never the wrong call, even if it turns out to be nothing." },
      { text: "Try to remove the malware yourself", ok: false, why: "DIY clean-ups usually miss the hidden parts and destroy the traces IT needs. You can also accidentally spread it to other machines." }
    ],
    why: "Containing the problem is step one; handing it to the people trained to deal with it is step two. Report fast, don't investigate alone, and don't destroy anything."
  },
  {
    title: "Stop the invoice fraud",
    prompt: "A supplier you deal with every month emails to say their bank details have changed, and asks you to pay today. What do you do first?",
    options: [
      { text: "Pay it \u2014 the email looks exactly like their usual one", ok: false, why: "Looking right proves nothing. Attackers copy real email templates, and sometimes they're sending from the supplier's own hacked mailbox." },
      { text: "Call the supplier on the number you already had on file", ok: true, why: "A phone call to a number you already trust is the one check an attacker can't fake. Never use a number from the new email \u2014 that just rings them. This single habit stops most invoice fraud, and legitimate suppliers expect you to do it." },
      { text: "Reply to the email and ask them to confirm", ok: false, why: "If the attacker controls or is watching that mailbox, they'll simply reply \u201cyes, that's correct\u201d. You'd be asking the thief to vouch for the theft." },
      { text: "Forward it to a colleague so they can pay it", ok: false, why: "That just moves the risk to someone with less context. The payment still goes to the wrong account." }
    ],
    why: "Any change to bank details gets verified by voice, on a number you already hold, before a penny moves. Urgency is the pressure tactic \u2014 slowing down is the defence."
  },
  {
    title: "Choose the password that holds",
    prompt: "Four colleagues suggest a new password. Which one would take an attacker the longest to break?",
    options: [
      { text: "Summer2026!", ok: false, why: "A season, a year, and an exclamation mark is the most predictable pattern there is. Cracking tools try these combinations first." },
      { text: "P@ssw0rd", ok: false, why: "Swapping letters for look-alike symbols is the oldest trick in the book, and every cracking tool knows it. This is guessed in under a second." },
      { text: "rusty-anchor-pepper-moon", ok: true, why: "Four unrelated words make a long password you can actually remember, and length is what defeats guessing. Each extra character multiplies the work for an attacker, while swapping an o for a zero adds almost nothing." },
      { text: "Your pet's name and birth year", ok: false, why: "Both are usually findable on social media, and attackers check there first. Anything personal is a weak secret." }
    ],
    why: "Length beats cleverness. A few random words \u2014 or whatever a password manager generates \u2014 beats a short password full of symbols every time."
  },
  {
    title: "Pick the genuine website",
    prompt: "You need to sign in to your bank. Four addresses appear. Which one is really the bank?",
    options: [
      { text: "yourbank.com", ok: true, why: "Read a web address from the left up to the first single slash, then look at the last two parts before it \u2014 that's the real owner. Here it's \u201cyourbank.com\u201d, so this is the genuine site. Everything after the slash can say anything and means nothing." },
      { text: "yourbank.secure-login.net", ok: false, why: "The real owner is the bit at the end: secure-login.net. \u201cyourbank\u201d is just a label someone added on the front to reassure you." },
      { text: "yourbank-verify.com", ok: false, why: "A hyphen makes a completely different website. yourbank-verify.com has nothing to do with yourbank.com." },
      { text: "login-yourbank.com.co", ok: false, why: "The ending is .com.co, not .com. Adding an extra country code after .com is a common way to make a fake look familiar." }
    ],
    why: "Owner first, decoration later. Check the two parts immediately before the first single slash \u2014 or skip links entirely and type the address yourself."
  },
  {
    title: "Deal with the found USB stick",
    prompt: "You find a USB stick in the car park with a sticker that reads \u201cPayroll 2026 \u2014 Confidential\u201d. What now?",
    options: [
      { text: "Plug it in to find out whose it is", ok: false, why: "That's exactly what the label is for. A prepared USB stick can install software the moment it's connected, before you see a single file." },
      { text: "Plug it into a spare computer instead", ok: false, why: "A spare machine is still on the company network. Infecting it gives the attacker the same foothold." },
      { text: "Hand it to IT or reception without plugging it in", ok: true, why: "You lose nothing by handing it over, and you avoid the one action that can't be undone. If it genuinely belongs to a colleague, IT can return it safely; if it was dropped deliberately, you've just stopped the attack at the door." },
      { text: "Take it home and look at it there", ok: false, why: "Your home computer is usually less protected, and anything it catches can travel back to work on your accounts." }
    ],
    why: "Irresistible labels are the bait. Never connect storage you didn't buy or wasn't given to you by IT."
  },
  {
    title: "Handle the code you didn't ask for",
    prompt: "Your phone buzzes with a six-digit sign-in code for your work account \u2014 but you weren't signing in. What does it mean, and what do you do?",
    options: [
      { text: "Ignore it, it's probably a glitch", ok: false, why: "Codes aren't sent by accident. Ignoring it leaves someone sitting at your login page with your password, trying again." },
      { text: "Type it into the website to clear it", ok: false, why: "There's nothing to clear \u2014 entering it would simply complete the stranger's sign-in for them." },
      { text: "Don't share it, change your password, and tell IT", ok: true, why: "An unrequested code means somebody already has your password and is one step away from your account. The code is the only thing stopping them, so never read it out. Changing the password closes the gap, and telling IT lets them check whether other accounts are affected." },
      { text: "Send it to the person who says they're from IT", ok: false, why: "That's the whole scam. Genuine IT staff never need your code \u2014 they can't use it for anything except becoming you." }
    ],
    why: "A code you didn't request is an alarm bell, not an annoyance. Never share it, reset the password, and report it."
  },
  {
    title: "Leave your desk safely",
    prompt: "You're nipping out for a ten-minute coffee. What's the right move before you go?",
    options: [
      { text: "Lock the screen and take your badge with you", ok: true, why: "Locking takes one second (Windows key + L) and means nobody can read your email, send messages as you, or copy files while you're gone. Taking your badge stops someone using it to reach areas they shouldn't \u2014 and stops you being locked out." },
      { text: "Leave it unlocked \u2014 you'll only be a minute", ok: false, why: "Most desk incidents take seconds, not minutes, and they're often not malicious \u2014 just a visitor or a cleaner who sees something they shouldn't." },
      { text: "Turn the monitor off", ok: false, why: "The screen goes dark but the computer stays wide open. Anyone can switch it back on and carry on where you left off." },
      { text: "Ask a nearby colleague to keep an eye on it", ok: false, why: "They'll be absorbed in their own work within a minute, and it isn't their responsibility if something happens." }
    ],
    why: "Lock the screen every single time, even for a moment. It costs a second and removes the easiest way into your account."
  }
];

function startEscape() {
  gameKicker.textContent = "GAME 06";
  gameTitle.textContent = "Micro-Escape Room";
  gameArea.append(document.querySelector("#escape-template").content.cloneNode(true));
  if (window.lucide) lucide.createIcons();
  const puzzles = pickFresh("escape", escapePuzzles, 3, (puzzle) => puzzle.title);
  let step = 0;
  let seconds = 300;

  const title = document.querySelector("#escape-title");
  const prompt = document.querySelector("#escape-prompt");
  const options = document.querySelector("#escape-options");
  const feedback = document.querySelector("#escape-feedback");
  const nextButton = document.querySelector("#escape-next");
  const nextLabel = document.querySelector("#escape-next-label");
  const locks = document.querySelectorAll(".escape-lock");

  function render() {
    const puzzle = puzzles[step];
    title.textContent = `Lock ${step + 1} \u2014 ${puzzle.title}`;
    prompt.textContent = puzzle.prompt;
    gameProgress.textContent = `Lock ${step + 1} / ${puzzles.length}`;
    locks.forEach((lock, i) => lock.classList.toggle("open", i < step));
    feedback.hidden = true;
    nextButton.hidden = true;
    options.replaceChildren();
    shuffle([...puzzle.options]).forEach((opt) => {
      const button = document.createElement("button");
      button.className = "escape-option";
      button.textContent = opt.text;
      button.addEventListener("click", () => {
        if (state.finished || !nextButton.hidden) return;
        feedback.hidden = false;
        feedback.className = `feedback-panel ${opt.ok ? "correct" : "wrong"}`;
        if (opt.ok) {
          button.classList.add("correct");
          feedback.innerHTML = `<strong>That's the one.</strong> ${opt.why}<span class="escape-why">${puzzle.why}</span>`;
          options.querySelectorAll(".escape-option").forEach((other) => { other.disabled = true; });
          nextButton.hidden = false;
          nextLabel.textContent = step + 1 >= puzzles.length ? "Open the door" : "Next lock";
          nextButton.focus();
        } else {
          button.classList.add("wrong");
          feedback.innerHTML = `<strong>Not that one.</strong> ${opt.why}`;
          setTimeout(() => button.classList.remove("wrong"), 500);
        }
      });
      options.append(button);
    });
    if (window.lucide) lucide.createIcons();
  }

  nextButton.addEventListener("click", () => {
    step += 1;
    if (step >= puzzles.length) finish();
    else render();
  });
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
    const win = step >= puzzles.length;
    if (win) locks.forEach((lock) => lock.classList.add("open"));
    completeGame("escape");
    showResult(win ? "You're out!" : "Time's up", win
      ? "Nice work — you picked the safe option at every lock. Slow down, check with someone you already trust, and report anything odd."
      : "The exit stayed locked this time. Remember: isolate anything behaving oddly, verify by a route you already trust, and always report to IT.");
  }
}

/* ===== Game 07: Security Crossword ===== */
// Each puzzle is one 8-letter across word with down words hanging off its letters.
const crosswordPuzzles = [
  {
    id: "basics",
    words: [
      { num: 2, dir: "across", row: 2, col: 1, answer: "PASSWORD", clue: "The secret word that unlocks your account" },
      { num: 1, dir: "down", row: 1, col: 6, answer: "LOGIN", clue: "Signing in to an account" },
      { num: 2, dir: "down", row: 2, col: 1, answer: "PHISHING", clue: "Fake messages that try to trick you into clicking" },
      { num: 3, dir: "down", row: 2, col: 3, answer: "SCAM", clue: "A trick to steal your money or information" },
      { num: 4, dir: "down", row: 2, col: 5, answer: "WIFI", clue: "Wireless internet you should protect with a password" },
      { num: 5, dir: "down", row: 2, col: 8, answer: "DATA", clue: "Personal information worth protecting" }
    ]
  },
  {
    id: "defences",
    words: [
      { num: 2, dir: "across", row: 2, col: 1, answer: "FIREWALL", clue: "The barrier that blocks unwanted traffic from the internet" },
      { num: 1, dir: "down", row: 1, col: 2, answer: "VIRUS", clue: "Harmful software that spreads from machine to machine" },
      { num: 2, dir: "down", row: 2, col: 1, answer: "FRAUD", clue: "Deceiving someone to take their money" },
      { num: 3, dir: "down", row: 2, col: 3, answer: "RISK", clue: "The chance that something could go wrong" },
      { num: 4, dir: "down", row: 2, col: 5, answer: "WARNING", clue: "An alert that something may be unsafe" },
      { num: 5, dir: "down", row: 2, col: 8, answer: "LOCK", clue: "What you do to your screen before walking away" }
    ]
  },
  {
    id: "habits",
    words: [
      { num: 2, dir: "across", row: 2, col: 1, answer: "SECURITY", clue: "Keeping information safe from harm" },
      { num: 1, dir: "down", row: 1, col: 3, answer: "SCAM", clue: "A trick to steal your money or information" },
      { num: 2, dir: "down", row: 2, col: 1, answer: "SHRED", clue: "Destroy paper so nobody can read it" },
      { num: 3, dir: "down", row: 2, col: 2, answer: "EMAIL", clue: "Everyday messages that scammers love to fake" },
      { num: 4, dir: "down", row: 2, col: 4, answer: "UPDATE", clue: "Install this to fix security holes" },
      { num: 5, dir: "down", row: 2, col: 6, answer: "IDENTITY", clue: "Who you are \u2014 thieves try to steal it" }
    ]
  }
];

function startCrossword() {
  gameKicker.textContent = "GAME 07";
  gameTitle.textContent = "Security Crossword";
  gameProgress.textContent = "Pick a clue, then type the word";
  gameArea.append(document.querySelector("#crossword-template").content.cloneNode(true));
  if (window.lucide) lucide.createIcons();

  const [puzzle] = pickFresh("crossword", crosswordPuzzles, 1, (item) => item.id);
  const rows = 9;
  const cols = 8;
  const cells = {};
  const inputs = {};
  const words = puzzle.words.map((word) => {
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
const sortRounds = [
  {
    eyebrow: "ROUND 1 \u2014 WHAT'S SAFE TO SHARE?",
    instructions: "Tap an item, then tap a box to sort it. Some information is fine to share with anyone; some must stay inside the company. Press Check when every item is sorted.",
    binA: { label: "Safe to share", icon: "globe" },
    binB: { label: "Keep private", icon: "lock" },
    items: [
      { label: "Company press release", bin: "a" },
      { label: "The office lunch menu", bin: "a" },
      { label: "A published blog post", bin: "a" },
      { label: "Your company's public website", bin: "a" },
      { label: "The careers page job advert", bin: "a" },
      { label: "A product brochure handed out at events", bin: "a" },
      { label: "The office opening hours", bin: "a" },
      { label: "A photo from the company charity run", bin: "a" },
      { label: "A customer's credit card number", bin: "b" },
      { label: "An employee's home address", bin: "b" },
      { label: "A login one-time code", bin: "b" },
      { label: "The internal salary spreadsheet", bin: "b" },
      { label: "A colleague's medical note", bin: "b" },
      { label: "The list of customers and their contact details", bin: "b" },
      { label: "A photo of your building pass", bin: "b" },
      { label: "Next quarter's results before they're announced", bin: "b" }
    ],
    done: "When in doubt, keep it private \u2014 especially anything that identifies a person, any password or code, or internal company details."
  },
  {
    eyebrow: "ROUND 2 \u2014 WHAT'S SAFE TO PROMPT?",
    instructions: "AI assistants keep whatever you type into them. Sort what's fine to put in a prompt and what should never be pasted into an AI tool.",
    binA: { label: "Safe to prompt", icon: "sparkles" },
    binB: { label: "Never paste into AI", icon: "shield-alert" },
    items: [
      { label: "Explain phishing in simple words", bin: "a" },
      { label: "Draft an agenda for a team meeting", bin: "a" },
      { label: "Shorten our published press release", bin: "a" },
      { label: "Suggest ideas for a team quiz", bin: "a" },
      { label: "Rewrite this paragraph more politely", bin: "a" },
      { label: "Give me ten icebreaker questions", bin: "a" },
      { label: "What does two-factor authentication mean?", bin: "a" },
      { label: "Summarise this public news article", bin: "a" },
      { label: "A customer's name and account number", bin: "b" },
      { label: "An unreleased financial report", bin: "b" },
      { label: "A photo of a colleague's payslip", bin: "b" },
      { label: "Your work password", bin: "b" },
      { label: "A list of staff emails and phone numbers", bin: "b" },
      { label: "A contract that hasn't been signed yet", bin: "b" },
      { label: "Screenshots of an internal system", bin: "b" },
      { label: "A customer complaint with their full details", bin: "b" }
    ],
    done: "Treat an AI prompt like a public post: anything you paste in may be stored or reviewed. General questions and already-public text are fine \u2014 customer data, unreleased documents, and credentials are not."
  }
];

function startDataDefender() {
  gameKicker.textContent = "GAME 08";
  gameTitle.textContent = "Sort It Out";
  gameArea.append(document.querySelector("#data-template").content.cloneNode(true));

  const eyebrow = document.querySelector("#data-eyebrow");
  const instructions = document.querySelector("#data-instructions");
  const headA = document.querySelector("#bin-a-head");
  const headB = document.querySelector("#bin-b-head");
  const tray = document.querySelector("#data-tray");
  const dropA = document.querySelector("#bin-a .bin-drop");
  const dropB = document.querySelector("#bin-b .bin-drop");
  const checkBtn = document.querySelector("#data-check");
  const nextBtn = document.querySelector("#data-next");
  const nextLabel = document.querySelector("#data-next-label");
  const feedback = document.querySelector("#data-feedback");
  let roundIndex = 0;
  const drawn = sortRounds.map((round, i) => shuffle([
    ...pickFresh(`sort-${i}-a`, round.items.filter((item) => item.bin === "a"), 4),
    ...pickFresh(`sort-${i}-b`, round.items.filter((item) => item.bin === "b"), 4)
  ]));
  let selected = null;

  function updateProgress() {
    const total = drawn[roundIndex].length;
    const placed = total - tray.querySelectorAll(".data-chip").length;
    gameProgress.textContent = `Round ${roundIndex + 1} / ${sortRounds.length} \u00b7 Sorted ${placed} / ${total}`;
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

  function render() {
    const round = sortRounds[roundIndex];
    eyebrow.textContent = round.eyebrow;
    instructions.textContent = round.instructions;
    headA.innerHTML = `<i data-lucide="${round.binA.icon}"></i> ${round.binA.label}`;
    headB.innerHTML = `<i data-lucide="${round.binB.icon}"></i> ${round.binB.label}`;
    tray.replaceChildren();
    dropA.replaceChildren();
    dropB.replaceChildren();
    selected = null;
    checkBtn.hidden = false;
    nextBtn.hidden = true;
    feedback.hidden = true;
    shuffle([...drawn[roundIndex]]).forEach((item) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "data-chip";
      chip.textContent = item.label;
      chip.dataset.bin = item.bin;
      chip.addEventListener("click", (event) => { event.stopPropagation(); select(chip); });
      tray.append(chip);
    });
    updateProgress();
    if (window.lucide) lucide.createIcons();
  }

  document.querySelector("#bin-a").addEventListener("click", () => moveTo(dropA));
  document.querySelector("#bin-b").addEventListener("click", () => moveTo(dropB));
  tray.addEventListener("click", () => moveTo(tray));

  checkBtn.addEventListener("click", () => {
    let allCorrect = true;
    [[dropA, "a"], [dropB, "b"]].forEach(([drop, want]) => {
      drop.querySelectorAll(".data-chip").forEach((chip) => {
        const ok = chip.dataset.bin === want;
        chip.classList.toggle("correct", ok);
        chip.classList.toggle("wrong", !ok);
        if (!ok) allCorrect = false;
      });
    });
    if (!allCorrect) {
      showToast("Some are misplaced \u2014 the red ones belong in the other box.");
      return;
    }
    const round = sortRounds[roundIndex];
    if (roundIndex + 1 >= sortRounds.length) {
      completeGame("data");
      showResult("Sorted!", round.done);
      return;
    }
    showToast("Round 1 cleared.");
    feedback.hidden = false;
    feedback.className = "feedback-panel correct";
    feedback.textContent = round.done;
    checkBtn.hidden = true;
    nextBtn.hidden = false;
    nextLabel.textContent = "Next round";
    nextBtn.focus();
  });

  nextBtn.addEventListener("click", () => {
    roundIndex += 1;
    render();
  });

  render();
}

/* ===== Game 09: Security Match (memory pairs) ===== */
const matchPairs = [
  { risk: "Phishing email", fix: "Don't click \u2014 report it" },
  { risk: "Weak password", fix: "Use a long passphrase" },
  { risk: "Work laptop or phone", fix: "Don't connect to a public network" },
  { risk: "A USB stick you found", fix: "Don't plug it in" },
  { risk: "Software update ready", fix: "Install it promptly" },
  { risk: "Lost work laptop", fix: "Report it right away" },
  { risk: "Stepping away from your desk", fix: "Lock the screen" },
  { risk: "Same password everywhere", fix: "One password per account" },
  { risk: "A code you didn't ask for", fix: "Never share it" },
  { risk: "Paper with customer details", fix: "Shred it" },
  { risk: "Stranger following you in", fix: "Ask them to badge in" },
  { risk: "Supplier changes bank details", fix: "Phone a number you already have" },
  { risk: "Unexpected attachment", fix: "Check with the sender first" },
  { risk: "Confidential chat in public", fix: "Move somewhere private" },
  { risk: "Old files you no longer need", fix: "Delete them securely" },
  { risk: "Suspicious message you reported", fix: "Then delete it" }
];

function startMatch() {
  gameKicker.textContent = "GAME 09";
  gameTitle.textContent = "Security Match";
  const pairs = pickFresh("match", matchPairs, 6, (pair) => pair.risk);
  gameProgress.textContent = `0 / ${pairs.length} pairs`;
  gameArea.append(document.querySelector("#match-template").content.cloneNode(true));
  if (window.lucide) lucide.createIcons();

  const cards = [];
  pairs.forEach((pair, i) => {
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
      gameProgress.textContent = `${matched} / ${pairs.length} pairs`;
      first = null;
      if (matched === pairs.length) finish();
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