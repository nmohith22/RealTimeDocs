import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withYjs, slateNodesToInsertDelta, YjsEditor } from '@slate-yjs/core';
import { yDocToSlate } from '@slate-yjs/react';
import { yText } from './yjs';
function App() {
    // Convert the Yjs document to Slate nodes
    const [value, setValue] = useState(() => yDocToSlate(yText.doc));
    // Instantiate a Slate editor, enhanced with Yjs
    const [editor] = useState(() => {
        const base = withReact(createEditor());
        return withYjs(base, yText);
    });
    // Connect/disconnect the editor for real-time sync
    useEffect(() => {
        YjsEditor.connect(editor);
        return () => {
            YjsEditor.disconnect(editor);
        };
    }, [editor]);
    // Initialize the shared document if empty
    useEffect(() => {
        if (yText.length === 0) {
            yText.applyDelta(slateNodesToInsertDelta([
                { type: 'paragraph', children: [{ text: 'Start collaborating...' }] },
            ]));
        }
    }, []);
    return (_jsx("div", { className: "p-4", children: _jsx(Slate, { editor: editor, value: value, onChange: setValue, children: _jsx(Editable, { placeholder: "Type something..." }) }) }));
}
export default App;
