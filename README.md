# RealTimeDocs

A web-based real-time collaborative document editor built with React, TypeScript, Vite, Slate, and Yjs. Deploys to GitHub Pages and supports local development with a Yjs WebSocket server.

## Features

- **Real-Time Collaboration**
- **Rich-Text Editing**
- **Versioned History**

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Editor**: Slate + Slate History
- **Real-Time Sync**: Yjs (`@slate-yjs/core` + Yjs WebSocket provider)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/<YOUR_GITHUB_USERNAME>/RealTimeDocs.git
   cd RealTimeDocs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure GitHub Pages**
   - Update the `base` field in `vite.config.ts` to your GitHub Pages URL:
     ```ts
     base: 'https://<YOUR_GITHUB_USERNAME>.github.io/RealTimeDocs/'
     ```

### Development

1. **Start a local Yjs server** (choose one):
   - **Official Y-WebSocket**:
     ```bash
     npm install --save-dev y-websocket
     node ./node_modules/y-websocket/bin/server.js --port 1234
     ```
   - **Hocuspocus CLI**:
     ```bash
     npm install --save-dev @hocuspocus/cli
     npx @hocuspocus/cli --port 1234
     ```

2. **Run the app**
   ```bash
   npm run dev
   ```

3. **Open** http://localhost:5173 in two browser tabs; edits sync in real time.
