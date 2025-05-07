export default function SortSelector({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="w-full flex items-center justify-center mb-1 text-sm font-semibold text-gray-700">
        Sırala
      </label>
      
      <div className="relative w-40">
        <select
          className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-white text-gray-700"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="increase">Fiyat (Artan)</option>
          <option value="decrease">Fiyat (Azalan)</option>
        </select>

        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
