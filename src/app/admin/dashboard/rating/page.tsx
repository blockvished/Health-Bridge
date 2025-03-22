export default function RatingReviews() {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg shadow-md w-full max-w-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">Rating & Reviews</h3>
        <label className="flex items-center gap-2 text-gray-600 text-sm">
          <input type="checkbox" className="hidden" />
          <div className="w-10 h-5 bg-gray-300 rounded-full relative cursor-pointer">
            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300"></div>
          </div>
          <span className="whitespace-nowrap">Enable rating in frontend</span>
        </label>
      </div>

      <div className="border-t border-gray-200 pt-4 text-center text-gray-500 text-sm">
        No data found!
      </div>
    </div>
  );
}
