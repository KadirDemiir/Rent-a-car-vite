export default function CarIndexPropComp({photo, title, content}){
    return(
        <div className="flex items-center space-x-4">
            {photo}
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="font-semibold">{content}</div>
        </div>
      </div>
    );
}
