import React, { useEffect, useState } from 'react';
import { createEditor, Descendant, BaseElement } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withYjs, slateNodesToInsertDelta, yTextToSlateElement, YjsEditor } from '@slate-yjs/core';
import { yText, provider } from './yjs';

// Define a custom type for Slate elements
type CustomElement = BaseElement & {
  type: string;
  children: Array<{ text: string }>;
};

// Extend the Descendant type to include CustomElement
declare module 'slate' {
  interface CustomTypes {
    Element: CustomElement;
  }
}

// Initialize or hydrate the Yjs document with default content
function initializeContent(): Descendant[] {
  if (yText.length === 0) {
    yText.applyDelta(
      slateNodesToInsertDelta([
        { type: 'paragraph', children: [{ text: 'Start collaboratively editing...' }] },
      ])
    );
  }
  // Convert the Yjs XML Text into a Slate element and use its children as the editor value
  return (yTextToSlateElement(yText).children) as Descendant[];
}

const App: React.FC = () => {
  // Create a Slate editor enhanced with Yjs
  const [editor] = useState(() => withYjs(withReact(createEditor()), yText));
  // Set initial value from the shared document
  const [value, setValue] = useState<Descendant[]>(initializeContent);

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