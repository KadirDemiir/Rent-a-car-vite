export default function CarIndexPropComp({photo, title, content}){
  console.log('CarIndexPropComp => ', {content});
    return(
        <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm border border-gray-50">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-white flex items-center justify-center text-blue-600">
                {photo}
            </div>
        <div className="min-w-0">
          <div className="text-xs text-gray-400 truncate">{title}</div>
          <div className="font-medium text-sm truncate">{content}</div>
        </div>
      </div>
    );
}
