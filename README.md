# 3D Cube AR.js Demo

A simple Three.js + AR.js project: 3D cube with unfold/fold animation, marker-based AR (Hiro marker).

## Features
- 3D animated cube (fold/unfold on click)
- Marker-based AR using AR.js (Hiro marker)
- Works on desktop and mobile browsers

## Setup (For Beginners, Windows)

### 0. Prerequisites
- **Node.js**: Download and install from https://nodejs.org/ (choose Windows Installer, just click Next until finish)
- **VS Code** (optional, for editing/viewing code): https://code.visualstudio.com/ (choose Windows, just click Next until finish)
- **Git** (optional, for cloning repo): https://git-scm.com/ (choose Windows, just click Next until finish)

### 1. Clone the Project using Git
- Open a terminal or command prompt in the folder where you want to save the project (e.g. Desktop)
- Type:
```bash
git clone <paste-the-http-link-you-copied-from-GitHub>
```
- Copy the HTTP link from the green "Code" button on the GitHub page of this project and paste it after `git clone` above.
- Open the cloned folder in VS Code (right-click > "Open with Code" or open VS Code then File > Open Folder)

### 2. Install Dependencies
- Right-click inside the folder and choose "Open in Terminal" or "Open PowerShell window here"
- Type:
```bash
npm install
```

### 3. Start Local Server
- In the terminal, type:
```bash
npm run server
```
- Open your browser and go to http://localhost:3000

### 4. Share to Mobile using ngrok (Windows)
#### a. Download ngrok
- Go to https://ngrok.com/download, choose Windows (64-bit or 32-bit)
- Unzip the ZIP file, copy `ngrok.exe` to Desktop or your project folder

#### b. Register a free ngrok account
- Go to https://ngrok.com/, sign up and log in
- Copy your authtoken from the dashboard
- In the terminal, type:
```bash
ngrok config add-authtoken <your-authtoken>
```

#### c. Start ngrok tunnel
- In the terminal, type:
```bash
ngrok http 3000
```
- You will see:
```
Forwarding https://xxxx-xxxx-3000.ngrok.io -> http://localhost:3000
```
- Copy the HTTPS link (starts with https://...)

### 5. Open on Your Phone
- On your phone, open Chrome/Safari and go to the ngrok link you just copied
- Allow camera access when prompted
- Click the "Tải ảnh marker Hiro (JPG)" button to download/view the Hiro marker
- Print the marker or open it on another screen, then show it to your phone's camera

## File Roles
- `index.html`: Loads scripts, UI, marker download button.
- `index.js`: Three.js scene, AR.js setup, cube logic.
- `pattern-hiro.patt`: Marker pattern file for AR.js (code only).
- `camera_para.dat`: Camera calibration file for AR.js (code only).
- `HIRO.jpg`/`HIRO.png`: Marker image for printing/showing to camera (not for code).

## Troubleshooting
- If AR does not appear:
  - Check camera permissions in your browser.
  - Use the correct ngrok HTTPS link on your phone.
  - The marker must be clear and well-lit.
- Check the browser console for errors.

## Credits
- [Three.js](https://threejs.org/)
- [AR.js](https://ar-js-org.github.io/AR.js-Docs/)
- Hiro marker by ARToolKit
