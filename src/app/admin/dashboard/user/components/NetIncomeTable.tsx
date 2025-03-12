const NetIncomeTable: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-4">Net Income</h2>
    <div className="flex items-center justify-between py-3 border-b mb-4">
      <div className="flex items-center">
        <span className="mr-2">Fiscal year</span>
        <svg
          className="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
      <span className="font-medium">2024</span>
    </div>

    <div className="flex justify-between items-center">
      <span>Income</span>
      <span className="text-blue-600 font-semibold">$1000</span>
    </div>
  </div>
);

export default NetIncomeTable;