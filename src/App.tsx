import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, Descendant, Editor, BaseElement, BaseText } from 'slate';
import { Slate, Editable, withReact, RenderLeafProps, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import { withYjs, slateNodesToInsertDelta, yTextToSlateElement, YjsEditor } from '@slate-yjs/core';
import { yText, provider } from './yjs';

// Define custom types for Slate elements
type ParagraphElement = {
  type: 'paragraph';
  children: Descendant[];
};

type CustomElement = ParagraphElement;
declare module 'slate' {
  interface CustomTypes {
    Element: CustomElement;
  }

  // Extend BaseText to include custom formatting marks
  interface CustomText extends BaseText {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
  }
}

declare module 'slate' {
  interface CustomTypes {
    Text: CustomText;
  }
}

// Define the mark types
type Format = 'bold' | 'italic' | 'code';
const MARK_TYPES: Format[] = ['bold', 'italic', 'code'];

// Toggle formatting marks
const isMarkActive = (editor: Editor, format: Format) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as Record<Format, boolean>)[format] === true : false;
};
const toggleMark = (editor: Editor, format: Format) => {
  const active = isMarkActive(editor, format);
  if (active) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
};

// Render custom leaf nodes for formatting
const renderLeaf = useCallback((props: RenderLeafProps) => {
  let { children, leaf, attributes } = props;
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.code) children = <code>{children}</code>;
  return <span {...attributes}>{children}</span>;
}, []);

// Toolbar for formatting buttons
const Toolbar: React.FC = () => {
  const editor = useSlate();
  return (
    <div style={{ marginBottom: 8 }}>
      {MARK_TYPES.map(format => (
        <button
          key={format}
          onMouseDown={e => { e.preventDefault(); toggleMark(editor, format); }}
          style={{ fontWeight: isMarkActive(editor, format) ? 'bold' : 'normal', marginRight: 4 }}
        >
          {format[0].toUpperCase()}
        </button>
      ))}
    </div>
  );
};

// Initialize or hydrate the shared document
function initializeContent(): Descendant[] {
  const initial: Descendant[] = [
    { type: 'paragraph', children: [{ text: 'Start collaboratively editing…' }] },
  ];
  if (yText.length === 0) {
    yText.applyDelta(slateNodesToInsertDelta(initial));
  }
  return (yTextToSlateElement(yText).children) as Descendant[];
}

const App: React.FC = () => {
  // Create a Yjs-enabled, history-backed Slate editor
  const editor = useMemo(
    () => withYjs(withHistory(withReact(createEditor())), yText),
    []
  );
  const [value, setValue] = useState<Descendant[]>(initializeContent);

  useEffect(() => {
    provider.connect();
    YjsEditor.connect(editor);
    return () => {
      YjsEditor.disconnect(editor);
      provider.disconnect();
    };
  }, [editor]);

  return (
    <div className="p-4">
      <Toolbar />
      <Slate editor={editor} initialValue={value} onChange={newVal => setValue(newVal)}>
        <Editable
          renderLeaf={renderLeaf}
          placeholder="Type here…"
          spellCheck
          autoFocus
          onKeyDown={event => {
            if (!event.ctrlKey) return;
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
          }}
        />
      </Slate>
    </div>
  );
};

export default App;