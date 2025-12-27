import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {useTranslation} from "react-i18next";

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
    const {t} = useTranslation()
    return (
        <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">
                {t("adminpanel.pricing.add_campaign.campaign_content")}
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
            <span>{content.replace(/<[^>]*>/g, "").length} char</span>
        </div>
    );
}
