import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
// Create a Yjs document and WebSocket provider
export const ydoc = new Y.Doc();
export const provider = new WebsocketProvider('wss://demos.yjs.dev', 'realtime-docs-test-room', ydoc);
// Create or retrieve an XML Text type for collaborative content
export const yText = ydoc.get('content', Y.XmlText);
