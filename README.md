# Neon Protocol Riddle

A refactored React project for the Neon Protocol interactive riddle experience.

## Tech

- React
- Vite

## Run Locally

1. Install dependencies:

   npm install

2. Start dev server:

   npm run dev

3. Build production bundle:

   npm run build

4. Preview production build:

   npm run preview

## Project Structure

.
├── NeonProtocol.jsx
├── index.html
├── package.json
├── src
│   ├── App.jsx
│   ├── main.jsx
│   ├── components
│   │   ├── clues
│   │   │   └── ClueNode.jsx
│   │   ├── effects
│   │   │   ├── BgCanvas.jsx
│   │   │   ├── CipherReveal.jsx
│   │   │   └── Scanlines.jsx
│   │   ├── layout
│   │   │   └── ProtocolHud.jsx
│   │   ├── loader
│   │   │   └── ParticleLoader.jsx
│   │   └── panels
│   │       └── RiddlePanel.jsx
│   ├── constants
│   │   └── protocolData.js
│   ├── hooks
│   │   └── useMouseParallax.js
│   ├── pages
│   │   └── NeonProtocolPage.jsx
│   └── styles
│       └── global.css
└── vite.config.js

## Notes

- The original single-file page has been split into feature-focused modules.
- NeonProtocol.jsx is kept as a compatibility export to the new page location.
