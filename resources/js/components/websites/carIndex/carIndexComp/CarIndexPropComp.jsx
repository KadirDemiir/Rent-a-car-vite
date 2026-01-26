export default function CarIndexPropComp({photo, title, content}){
  console.log('CarIndexPropComp => ', {content});
    return(
        <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-blue-600">
                {photo}
            </div>
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="font-semibold">{content}</div>
        </div>
      </div>
    );
}
