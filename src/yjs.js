import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
// Create a Yjs document
export const ydoc = new Y.Doc();
// Connect to a Yjs websocket server 
export const provider = new WebsocketProvider('wss://demos.yjs.dev', 'realtime-docs-test-room', ydoc);
// Use XML text for Slate binding
export const yText = ydoc.getXmlText('content');
