# Cyber Quest

A dependency-free set of games for Cybersecurity Awareness Month, built with plain HTML, CSS, and JavaScript. Everything is written in everyday language for a non-technical audience. It includes nine short games:

- **Phish Swipe:** swipe messages to trust the safe ones and report the scams (90 seconds).
- **The Weakest Link:** build a password and watch a simulated hacker try to crack it.
- **Incident Rush:** put the response steps in the right order when a laptop is hacked.
- **Spot the Spy:** tap the risky habits hiding around a busy office (3 minutes).
- **Deepfake Detective:** study AI-generated and real face portraits, then spot the fakes by their tells — mismatched eyes, warped glasses, odd teeth, and melted backgrounds (3 minutes).
- **Micro-Escape Room:** solve three quick puzzles to contain an attack (5 minutes).
- **Security Crossword:** fill in a grid of everyday security words.
- **Sort It Out:** decide what information is safe to share and what should stay private.
- **Security Match:** a memory game that pairs each risk with the right response.

Which games you've played is remembered in your browser. Nothing you type (including passwords) is ever saved or sent anywhere.

## Run locally

Open `index.html` directly, or serve the directory with any static server:

```bash
npx serve .
```

To install it as an app, serve it over `http://localhost` or open the deployed HTTPS site in a supported browser. Use the browser's install button in the address bar or its menu (`Install Cyber Quest`, `Add to Home screen`, or similar). Service workers do not run from a `file://` URL, so installing requires localhost or HTTPS.

## Deploy to GitHub Pages

1. Create a GitHub repository and push these files to the `main` branch.
2. In the repository, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`, then save.

The site uses relative asset paths and requires no build command.

## Is it really free?

Yes. GitHub Pages hosts public static sites like this one for free, with HTTPS included. There is no server to run and no build step, so there are no hosting costs.

## Run it on an iPad kiosk

Open your GitHub Pages URL in Safari, tap the Share icon, and choose **Add to Home Screen** for a full-screen app icon. Turn on **Guided Access** (Settings → Accessibility) to lock the device to this one app for an event booth.