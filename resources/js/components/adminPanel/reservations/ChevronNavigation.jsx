import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ChevronNavigation({handlePrev, handleNext, startIndex, perPage, currentPage, totalPages, length})
{
    return(
        <>
            <div className="w-full flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg mt-2">
                    <button
                      onClick={handlePrev}
                      disabled={startIndex === 0}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 hover:border-gray-400 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
            
                    <span className="text-sm font-medium text-gray-600">
                      Sayfa {currentPage} / {totalPages}
                    </span>
            
                    <button
                      onClick={handleNext}
                      disabled={startIndex + perPage >= length}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 hover:border-gray-400 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-md"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
        </>
    );
}