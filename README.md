# Algoryx - 3D Web Experience & Community Platform 🚀

Welcome to the Algoryx 3D Web Experience repository! This project is a modern, high-performance web application designed for exploring, uploading, and interacting with 3D assets in a vibrant community environment.

## 🎯 Objective

The primary objective of Algoryx is to provide a seamless, interactive platform where 3D artists, developers, and enthusiasts can showcase their work, explore high-quality 3D models directly in the browser without requiring specialized software, and build a collaborative community around 3D web experiences. It aims to bridge the gap between complex 3D rendering and accessible web interfaces.

## 🌟 Key Features

- **Interactive 3D Viewer**: Seamlessly explore 3D models directly in your browser, powered by Three.js and React Three Fiber.
- **Immersive UI/UX**: A stunning interface with glassmorphism elements and micro-animations via Framer Motion.
- **Community-Driven**: Upload, showcase, and discover 3D assets created by other users in the community.
- **Responsive Design**: Fully optimized for both desktop and mobile experiences using Tailwind CSS.

## 🛠️ Tech Stack

This project is built using the latest and greatest in the web ecosystem:

- **Framework**: [Next.js 16](https://nextjs.org/) & [React 19](https://react.dev/)
- **3D Rendering**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/), & [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```text
algoryx/
├── public/                 # Static assets, fonts, and global icons
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, APIs)
│   ├── components/         # Reusable React components
│   │   ├── three/          # 3D canvas and WebGL components
│   │   └── ui/             # Standard UI elements (buttons, modals, etc.)
│   └── lib/                # Utility functions, typings, and configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind styling definitions
└── package.json            # Project dependencies & scripts
```

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/pujasahare16/algoryx-3D-assets.git
cd algoryx-3D-assets
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.
