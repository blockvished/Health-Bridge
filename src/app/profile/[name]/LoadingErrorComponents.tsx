// components/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-4 text-lg text-gray-600">
        Loading doctor profile...
      </span>
    </div>
  );
}

// components/ErrorMessage.tsx
type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-red-800 mb-2">
          Error Loading Profile
        </h2>
        <p className="text-red-600">{message}</p>
      </div>
    </div>
  );
}

// components/NotFound.tsx
type NotFoundProps = {
  doctorName: string;
};

export function NotFound({ doctorName }: NotFoundProps) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">
          Profile Not Found
        </h2>
        <p className="text-yellow-700">
          No doctor information found for "{doctorName}"
        </p>
      </div>
    </div>
  );
}