// components/EducationSection.tsx
type EducationData = {
  id: number;
  doctorId: number;
  title: string;
  institution: string;
  yearFrom: number;
  yearTo: number;
  details: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type EducationSectionProps = {
  educations: EducationData[];
};

export default function EducationSection({ educations }: EducationSectionProps) {
  if (!educations || educations.length === 0) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full mr-3">
            <span className="text-2xl">🎓</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Education</h2>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 bg-blue-200 h-full"></div>

        {educations
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((education, index) => (
            <div key={education.id} className="relative mb-12 last:mb-0">
              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>

              {/* Education card */}
              <div
                className={`w-5/12 ${
                  index % 2 === 0 ? "mr-auto pr-8" : "ml-auto pl-8"
                }`}
              >
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                  {/* Year badge */}
                  <div className="text-right mb-3">
                    <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                      {education.yearFrom} to {education.yearTo}
                    </span>
                  </div>

                  {/* Degree title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {education.title}
                  </h3>

                  {/* Institution */}
                  <p className="text-gray-600 font-medium mb-3">
                    {education.institution}
                  </p>

                  {/* Details if available */}
                  {education.details && (
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {education.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}