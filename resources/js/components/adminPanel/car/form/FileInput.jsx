export default function FileInput({ label, onChange }) {
    return (
        <div>
            <label className="block text-gray-700 mb-1 font-bold ">{label}</label>
            <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={onChange}
                className="w-full border border-gray-300 rounded-xl p-2"
            />
        </div>
    );
}
