// /ExperienceSection.tsx
type ExperienceData = {
  id: number;
  doctorId: number;
  title: string;
  organization: string;
  yearFrom: number;
  yearTo: number | null;
  details: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type ExperienceSectionProps = {
  experience: ExperienceData[];
};

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (!experience || experience.length === 0) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full mr-3">
            <span className="text-2xl">💡</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Experiences</h2>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 bg-green-200 h-full"></div>

        {experience
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((exp, index) => (
            <div key={exp.id} className="relative mb-12 last:mb-0">
              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg z-10"></div>

              {/* Experience card */}
              <div
                className={`w-5/12 ${
                  index % 2 === 0 ? "mr-auto pr-8" : "ml-auto pl-8"
                }`}
              >
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow relative">
                  {/* Year badge - positioned at top right corner */}
                  <div className="absolute -top-3 -right-3">
                    <span className="inline-block bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                      {exp.yearFrom}-{exp.yearTo ? exp.yearTo : "Present"}
                    </span>
                  </div>

                  {/* Position title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 mt-2">
                    {exp.title}, {exp.organization}
                  </h3>

                  {/* Details */}
                  {exp.details && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {exp.details}
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