# TypeBlitz

TypeBlitz is a powerful web-based application designed to enhance typing skills through engaging and interactive games. With features like real-time multiplayer races, detailed performance analytics, typing replay, and customizable settings, TypeBlitz offers a comprehensive typing practice experience.

## 📌 Table of Contents

- [TypeBlitz](#typeblitz)
  - [📌 Table of Contents](#-table-of-contents)
  - [🚀 Features](#-features)
  - [📂 Directory Structure](#-directory-structure)
  - [🔧 Installation](#-installation)
    - [Clone the repository:](#clone-the-repository)
    - [Install dependencies:](#install-dependencies)
    - [Start the development server](#start-the-development-server)
    - [Build the project](#build-the-project)
  - [🚀 Usage](#-usage)
    - [🏁 Getting Started](#-getting-started)
    - [🎮 Game Modes](#-game-modes)
    - [⚙️ Customization](#️-customization)
    - [📊 Performance Tracking](#-performance-tracking)
  - [🤝 Contributing](#-contributing)

---

## 🚀 Features

- **🎮 Typing Games** – Engage in various typing exercises designed to improve speed and accuracy.
- **👥 Multiplayer Mode** – Compete in real-time typing races with friends or global players.
- **📊 Detailed Analytics** – Track typing speed, accuracy, rewind your typing, and monitor improvement over time.
- **⚙️ Customizable Settings** – Adjust difficulty levels, session lengths, and themes.
- **📡 WebSocket Support** – Enables real-time multiplayer interactions.

---

## 📂 Directory Structure

```plaintext
TypeBlitz/
├── apps/
│   ├── frontend/         # React-based frontend application
│   └── ws_server/        # WebSocket server for real-time multiplayer functionality
├── packages/
│   ├── eslint-config/    # Shared ESLint configuration
│   ├── typescript-config/ # Shared TypeScript configuration
│   └── ui/               # Shared UI components
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## 🔧 Installation

Ensure you have [pnpm](https://pnpm.io/) installed before proceeding.

### Clone the repository:

```bash
git clone https://github.com/saicharanbm/TypeBlitz.git
cd TypeBlitz
```

### Install dependencies:

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

### Build the project

```bash
pnpm build
```

---

## 🚀 Usage

### 🏁 Getting Started

Once the development server is running, open your browser and navigate to:

```plaintext
http://localhost:5173/
```

You'll be greeted by the TypeBlitz dashboard, where you can choose from various typing modes.

### 🎮 Game Modes

- **Solo Practice** – Improve your typing skills at your own pace.
- **Multiplayer Race** – Compete against other players in real time.
- **Custom Challenges** – Create personalized typing tests with adjustable settings.

### ⚙️ Customization

- Adjust text difficulty and time duration.
- Enable or disable backspace correction.
- Choose different themes and font styles.

### 📊 Performance Tracking

- View detailed analytics of your typing speed and accuracy.
- Replay your past typing sessions to analyze mistakes.
- Track your ranking in multiplayer games.

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. **Fork the repository**.
2. **Create a new branch** (`git checkout -b feature-branch`).
3. **Make your changes and commit** (`git commit -m "Added new feature"`).
4. **Push to the branch** (`git push origin feature-branch`).
5. **Open a Pull Request**.

---

💡 **Have feedback or suggestions?** Open an issue or start a discussion in the repository!
