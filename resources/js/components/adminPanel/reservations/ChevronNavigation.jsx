import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ChevronNavigation({handlePrev, handleNext, startIndex, perPage, currentPage, totalPages, length})
{
    return(
        <>
            <div className="w-full flex justify-between items-center px-6 pt-4">
                    <button
                      onClick={handlePrev}
                      disabled={startIndex === 0}
                      className="text-2xl rounded-full p-2 bg-gray-200 hover:bg-gray-300 shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
            
                    <span className="text-sm text-gray-700">
                      Sayfa {currentPage} / {totalPages}
                    </span>
            
                    <button
                      onClick={handleNext}
                      disabled={startIndex + perPage >= length}
                      className="text-2xl rounded-full p-2 bg-gray-200 hover:bg-gray-300 shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
        </>
    );
}