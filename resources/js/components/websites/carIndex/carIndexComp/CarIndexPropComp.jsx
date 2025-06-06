export default function CarIndexPropComp({photo_path, title, content}){
    return(
        <div className="flex items-center space-x-4">
            <img src={photo_path} alt="" className="w-10 h-10 border-1 border-blue-600 rounded-md" />
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="font-semibold">{content}</div>
        </div>
      </div>
    );
}