import React, { useEffect, useState } from 'react';
import { createEditor, Node } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withYjs, slateNodesToInsertDelta, yTextToSlateElement, YjsEditor } from '@slate-yjs/core';
import { yText, provider } from './yjs';

// Initialize or hydrate the Yjs document with default content
function initializeContent() {
  if (yText.length === 0) {
    yText.applyDelta(
      slateNodesToInsertDelta([
        { type: 'paragraph', children: [{ text: 'Start collaboratively editing...' }] },
      ])
    );
  }
  // Convert the Yjs XML text into a Slate element and use its children as the editor value
  return [yTextToSlateElement(yText)];
}

const App: React.FC = () => {
  // Create a Slate editor enhanced with Yjs
  const [editor] = useState(() => withYjs(withReact(createEditor()), yText));
  // Set initial value from the shared document
  const [value, setValue] = useState<Node[]>(initializeContent);

  useEffect(() => {
    // Connect WebSocket and the Yjs editor
    provider.connect();
    YjsEditor.connect(editor);
    return () => {
      YjsEditor.disconnect(editor);
      provider.disconnect();
    };
  }, [editor]);

  return (
    <div className="p-4">
      <Slate editor={editor} initialValue={value} onChange={setValue}>
        <Editable placeholder="Type something..." />
      </Slate>
    </div>
  );
};

export default App;