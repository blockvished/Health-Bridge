const Subscription: React.FC = () => {
  return (
    <div className="flex flex-col md:items-start p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm border border-gray-200">
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-3">Subscription</h2>
          <div className="border-t border-gray-300 pt-3 space-y-1">
            <p className="text-gray-700 font-medium">
              Subscription: <span className="font-normal">Basic Plan</span>
            </p>
            <p className="text-gray-700 font-medium">
              Price: <span className="font-normal">₹3990.00</span>
            </p>
            <p className="text-gray-700 font-medium">
              Billing Cycle: <span className="font-normal">Yearly</span>
            </p>
            <p className="text-gray-700 font-medium">
              Last Billing: <span className="font-normal">20 Jul 2024</span>
            </p>
            <p className="text-gray-700 font-medium">
              Expire:{" "}
              <span className="text-red-600">20 Jul 2025 (125 Days left)</span>
            </p>
          </div>
        </div>
        <div className="bg-green-100 border-t border-gray-300 text-green-700 flex items-center justify-between w-full rounded-b-lg">
          <span className="p-3">Payment Status:</span>
          <span className="font-semibold p-3">✔ Verified</span>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
