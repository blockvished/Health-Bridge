import AlertBanner from "./AlertBanner";

const FacebookAppSettings = () => {
  return (
    <>
      <AlertBanner
        type="alert"
        message="Please review the changes before saving."
      />
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border-b text-left">User ID</th>
            <th className="p-2 border-b text-left">Account Name</th>
            <th className="p-2 border-b text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-b">3919603828358215</td>
            <td className="p-2 border-b">Ravi Gupta</td>
            <td className="p-2 border-b text-red-500">Delete Account</td>
          </tr>
        </tbody>
      </table>
      <button className="bg-blue-600 text-white py-2 px-4 rounded mt-4">
        Save
      </button>
    </>
  );
};

export default FacebookAppSettings;
