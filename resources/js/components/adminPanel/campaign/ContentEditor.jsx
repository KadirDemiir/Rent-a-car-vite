import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
    toolbar: [
        [{ 'font': [] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link'],
        ['clean'],
    ],
};

export default function CampaignTextEditor({ content, setContent, currLan }) {
    return (
        <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">
                Kampanya Metni:
            </label>
            <div
                className="resize overflow-auto border rounded-md"
                style={{
                    minHeight: "200px",
                    maxHeight: "600px",
                    minWidth: "300px",
                    maxWidth: "100%",
                }}
            >
                <ReactQuill
                    key={currLan}
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    style={{ height: "100%", borderRadius: "0.5rem" }}
                />
            </div>
            <span>{content.replace(/<[^>]*>/g, "").length} karakter</span>
        </div>
    );
}
