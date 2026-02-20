import React, { useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import BulletList from '@tiptap/extension-bullet-list';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const CustomBulletList = BulletList.configure({
    itemTypeName: 'listItem',
    keepMarks: true,
    keepAttributes: true,
}).extend({
    addAttributes() {
        return {
            class: {
                default: null,
                renderHTML: attributes => ({ class: attributes.class }),
                parseHTML: element => element.getAttribute('class'),
            },
        };
    },
});

const ToolbarButton = ({ onClick, isActive, disabled, children, title, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-1.5 rounded text-sm font-medium transition-colors min-w-8 flex items-center justify-center ${
            isActive ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
        } ${disabled ? 'opacity-30 cursor-not-allowed' : ''} ${className}`}
        type="button"
    >
        {children}
    </button>
);

const EditorToolbar = ({ editor, onImageUpload }) => {
    if (!editor) return null;

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const setImageAlign = (align) => {
        editor.chain().focus().updateAttributes('image', { class: `align-${align}` }).run();
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-md sticky top-0 z-10 items-center">
            <div className="flex gap-1 border-r pr-2 mr-1">
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Geri Al">
                    ↩
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Yinele">
                    ↪
                </ToolbarButton>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-1">
                <select
                    className="p-1 text-sm border rounded bg-white h-8"
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val) editor.chain().focus().toggleHeading({ level: parseInt(val) }).run();
                        else editor.chain().focus().setParagraph().run();
                    }}
                    value={editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : ''}
                >
                    <option value="">Paragraf</option>
                    <option value="1">Başlık 1</option>
                    <option value="2">Başlık 2</option>
                    <option value="3">Başlık 3</option>
                </select>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-1">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Kalın">
                    <b>B</b>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="İtalik">
                    <i>I</i>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Altı Çizili">
                    <u>U</u>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Üstü Çizili">
                    <s>S</s>
                </ToolbarButton>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-1">
                <input
                    type="color"
                    onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                    className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                    title="Yazı Rengi"
                />
                <button
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className={`px-2 py-1 rounded text-sm h-8 ${editor.isActive('highlight') ? 'bg-yellow-200 ring-1 ring-yellow-400' : 'bg-white border hover:bg-gray-50'}`}
                    title="Vurgula"
                >
                    🖍
                </button>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-1">
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Sola Yasla">
                    ⬅
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Ortala">
                    ↔
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Sağa Yasla">
                    ➡
                </ToolbarButton>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-1">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Madde İşaretleri">
                    • List
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numaralı Liste">
                    1. List
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Görev Listesi">
                    ☑ List
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().updateAttributes('bulletList', { class: editor.isActive('bulletList', { class: 'two-columns' }) ? null : 'two-columns' }).run()}
                    isActive={editor.isActive('bulletList', { class: 'two-columns' })}
                    title="İki Sütunlu Liste"
                >
                    ⚏
                </ToolbarButton>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-1">
                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Link Ekle">
                    🔗
                </ToolbarButton>
                <ToolbarButton onClick={onImageUpload} isActive={editor.isActive('image')} title="Resim Yükle">
                    🖼️
                </ToolbarButton>

                {editor.isActive('image') && (
                    <div className="flex gap-1 bg-blue-50 p-1 rounded border border-blue-200 ml-1">
                        <ToolbarButton onClick={() => setImageAlign('left')} title="Resim Sola">
                            ⇠
                        </ToolbarButton>
                        <ToolbarButton onClick={() => setImageAlign('center')} title="Resim Orta">
                            ⬌
                        </ToolbarButton>
                        <ToolbarButton onClick={() => setImageAlign('right')} title="Resim Sağa">
                            ⇢
                        </ToolbarButton>
                    </div>
                )}
            </div>

            <div className="flex gap-1 border-r pr-2 mr-1">
                <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Tablo Ekle">
                    ▦
                </ToolbarButton>
                {editor.isActive('table') && (
                    <>
                        <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()} title="Tabloyu Sil" className="text-red-500">
                            🗑️
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="Sütun Ekle">
                            +❚
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()} title="Satır Ekle">
                            +☰
                        </ToolbarButton>
                    </>
                )}
            </div>

            <div className="flex gap-1">
                <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Ayırıcı Çizgi">
                    ―
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Alıntı">
                    ❝
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Biçimlendirmeyi Temizle">
                    🧹
                </ToolbarButton>
            </div>
        </div>
    );
};

export default function CampaignTextEditor({ content, setContent, currLan, label, showCount = true, page="campaign" }) {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,
            }),
            CustomBulletList,
            Underline,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
            Subscript,
            Superscript,
            Image.extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        class: {
                            default: 'align-center',
                            renderHTML: attr => ({ class: attr.class }),
                            parseHTML: el => el.getAttribute('class'),
                        },
                    }
                },
            }).configure({ inline: true, allowBase64: false }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            TaskList,
            TaskItem.configure({ nested: true }),
            Placeholder.configure({ placeholder: 'İçeriğinizi buraya yazın...' }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none px-4 py-2 min-h-[250px]',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [currLan, editor]);

    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('source', page);

        try {
            const response = await axios.post('/make-url', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.url && editor) {
                editor.chain().focus().setImage({ src: response.data.url }).run();
            }
        } catch (error) {
            console.error("Resim yükleme hatası:", error);
            alert("Resim yüklenirken bir hata oluştu. Lütfen dosya boyutunu kontrol edin.");
        }

        event.target.value = '';
    };

    return (
        <div className="w-full">
            <label className="block text-lg font-semibold mb-2 text-gray-700">
                {label ?? t("adminpanel.pricing.add_campaign.campaign_content")}
            </label>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            <div
                className="resize overflow-auto border border-gray-300 rounded-md bg-white shadow-sm flex flex-col"
                style={{
                    minHeight: "300px",
                    maxHeight: "800px",
                    minWidth: "300px",
                    maxWidth: "100%",
                }}
            >
                <EditorToolbar editor={editor} onImageUpload={handleImageUploadClick} />
                <EditorContent editor={editor} className="flex-grow cursor-text" />
            </div>

            <div className="flex justify-between mt-1 text-sm text-gray-500">
                {editor && (
                    <span>
                        {editor.storage.characterCount?.words?.() ?? 0} kelime
                    </span>
                )}
                {showCount && editor && (
                    <span>
                        {editor.storage.characterCount?.characters() ?? editor.getText().length} karakter
                    </span>
                )}
            </div>
        </div>
    );
}
