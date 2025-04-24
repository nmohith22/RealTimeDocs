import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, Editor } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import { withYjs, slateNodesToInsertDelta, yTextToSlateElement, YjsEditor } from '@slate-yjs/core';
import { yText, provider } from './yjs';
const MARK_TYPES = ['bold', 'italic', 'code'];
// Toggle formatting marks
const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};
const toggleMark = (editor, format) => {
    const active = isMarkActive(editor, format);
    if (active)
        Editor.removeMark(editor, format);
    else
        Editor.addMark(editor, format, true);
};
// Render custom leaf nodes for formatting
const renderLeaf = useCallback((props) => {
    let { children, leaf, attributes } = props;
    if (leaf.bold)
        children = _jsx("strong", { children: children });
    if (leaf.italic)
        children = _jsx("em", { children: children });
    if (leaf.code)
        children = _jsx("code", { children: children });
    return _jsx("span", { ...attributes, children: children });
}, []);
// Toolbar for formatting buttons
const Toolbar = () => {
    const editor = useSlate();
    return (_jsx("div", { style: { marginBottom: 8 }, children: MARK_TYPES.map(format => (_jsx("button", { onMouseDown: e => { e.preventDefault(); toggleMark(editor, format); }, style: { fontWeight: isMarkActive(editor, format) ? 'bold' : 'normal', marginRight: 4 }, children: format[0].toUpperCase() }, format))) }));
};
// Initialize or hydrate the shared document
function initializeContent() {
    const initial = [
        { type: 'paragraph', children: [{ text: 'Start collaboratively editing…' }] },
    ];
    if (yText.length === 0) {
        yText.applyDelta(slateNodesToInsertDelta(initial));
    }
    return (yTextToSlateElement(yText).children);
}
const App = () => {
    // Create a Yjs-enabled, history-backed Slate editor
    const editor = useMemo(() => withYjs(withHistory(withReact(createEditor())), yText), []);
    const [value, setValue] = useState(initializeContent);
    useEffect(() => {
        provider.connect();
        YjsEditor.connect(editor);
        return () => {
            YjsEditor.disconnect(editor);
            provider.disconnect();
        };
    }, [editor]);
    return (_jsxs("div", { className: "p-4", children: [_jsx(Toolbar, {}), _jsx(Slate, { editor: editor, initialValue: value, onChange: newVal => setValue(newVal), children: _jsx(Editable, { renderLeaf: renderLeaf, placeholder: "Type here\u2026", spellCheck: true, autoFocus: true, onKeyDown: event => {
                        if (!event.ctrlKey)
                            return;
                        switch (event.key) {
                            case 'b':
                                event.preventDefault();
                                toggleMark(editor, 'bold');
                                break;
                            case 'i':
                                event.preventDefault();
                                toggleMark(editor, 'italic');
                                break;
                            case '`':
                                event.preventDefault();
                                toggleMark(editor, 'code');
                                break;
                        }
                    } }) })] }));
};
export default App;
