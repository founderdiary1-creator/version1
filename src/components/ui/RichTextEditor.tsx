'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, 
  Heading1, Heading2, Heading3, Quote, List, ListOrdered, 
  Minus, Link as LinkIcon, Undo, Redo, Type
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Craft your narrative here...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#E31E24] hover:underline cursor-pointer font-medium transition-colors',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false, // Prevents Next.js hydration mismatch
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Premium typography configuration using Tailwind Typography (prose)
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] px-6 py-5 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#E31E24] prose-blockquote:border-l-4 prose-blockquote:border-[#E31E24] prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const toggleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Helper for rendering toolbar buttons
  const ToolbarButton = ({ 
    onClick, isActive = false, disabled = false, icon: Icon, title 
  }: { 
    onClick: () => void, isActive?: boolean, disabled?: boolean, icon: any, title: string 
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-md transition-all duration-200 ${
        isActive 
          ? 'bg-gray-200 text-[#E31E24] shadow-sm' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
      title={title}
      type="button"
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col shadow-sm focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-50 transition-all">
      
      {/* Premium Toolbar with Logical Grouping */}
      <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200 p-2 flex flex-wrap items-center gap-1.5 sticky top-0 z-10">
        
        {/* History Group */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} title="Undo" />
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} title="Redo" />
        </div>
        
        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Hierarchy Group */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')} icon={Type} title="Normal Text" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} title="Heading 1" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} title="Heading 2" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} title="Heading 3" />
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Formatting Group */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title="Underline" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} title="Strikethrough" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} icon={Code} title="Inline Code" />
          <ToolbarButton onClick={toggleLink} isActive={editor.isActive('link')} icon={LinkIcon} title="Link" />
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Structure Group */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Numbered List" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title="Quote Block" />
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} icon={Minus} title="Divider / Horizontal Rule" />
        </div>

      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto max-h-[600px] cursor-text" onClick={() => editor.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}