import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withYjs, slateNodesToInsertDelta, yTextToSlateElement, YjsEditor } from '@slate-yjs/core';
import { yText, provider } from './yjs';
// Initialize or hydrate the Yjs document with default content
function initializeContent() {
    if (yText.length === 0) {
        yText.applyDelta(slateNodesToInsertDelta([
            { type: 'paragraph', children: [{ text: 'Start collaboratively editing...' }] },
        ]));
    }
    // Convert the Yjs XML Text into a Slate element and use its children as the editor value
    return (yTextToSlateElement(yText).children);
}
const App = () => {
    // Create a Slate editor enhanced with Yjs
    const [editor] = useState(() => withYjs(withReact(createEditor()), yText));
    // Set initial value from the shared document
    const [value, setValue] = useState(initializeContent);
    useEffect(() => {
        // Connect WebSocket and the Yjs editor
        provider.connect();
        YjsEditor.connect(editor);
        return () => {
            YjsEditor.disconnect(editor);
            provider.disconnect();
        };
    }, [editor]);
    return (_jsx("div", { className: "p-4", children: _jsx(Slate, { editor: editor, initialValue: value, onChange: setValue, children: _jsx(Editable, { placeholder: "Type something..." }) }) }));
};
export default App;
