# 🚀 Tracker-APP

[![View Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://alex1go.github.io/Tracker-APP/)

🔗 [Look Demo](https://alex1go.github.io/Tracker-APP/)

👉 [https://alex1go.github.io/Tracker-APP/](https://alex1go.github.io/Tracker-APP/)


**Tracker-APP** — is a web application built using [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) designed to load, display, and compare experiment logs from CSV files. The application visualizes metrics as graphs and simplifies data analysis.

---

## 📦 Technologies

- ⚛️ React 18+
- ⚡ Vite
- 📊 Recharts
- 🗃️ CSV-parsing (For example, `papaparse`)
- 📁 Drag-and-drop / file input
- 🧠 Data caching
- 💾 redux-persist
- 🎯 ESLint + Prettier

---

## 📂 Project structure
```
Tracker-APP/

├── src/
│ ├── components/ # Reusable components (Chart, FileUploader)
│ ├── hooks
│ ├── utils/ # Helper functions (e.g. CSV parsing)
│ ├── App.jsx # Main application component
│ ├── main.jsx # Entry point
│ ├── App.css # Styles
│
├── .eslintrc.cjs # Settings ESLint
├── vite.config.js # Configuration Vite
├── package.json
├── README.md # You are reading it :)
```
## 🚀 Quick start

### 🔧 Installation

```bash
git clone https://github.com/ваш-юзер/Tracker-APP.git
cd Tracker-APP
npm install
```
###  ▶️ Launching a project in development mode
```bash
npm run dev
```
###  🛠 Building the project
```bash
npm run build
```
###  📦 Preview of production build
```bash
npm run preview
```
##  📁 Usage
1. Upload a CSV file with experiment metrics.

2. The app will parse and display the metrics on interactive graphs.

3. You can compare multiple experiments at once.