// components/DoctorHeader.tsx
import Image from "next/image";

type DoctorData = {
  id: number;
  name: string;
  specialization: string;
  degree: string;
  experience: number;
  aboutSelf: string;
  image: string;
};

type DoctorHeaderProps = {
  doctor: DoctorData;
};

export default function DoctorHeader({ doctor }: DoctorHeaderProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center">
        {/* Doctor Image */}
        <div className="flex-shrink-0 mr-12">
          {doctor.image ? (
            <div className="relative w-80 h-80">
              <Image
                src={doctor.image}
                alt={doctor.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="w-80 h-80 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-8xl text-gray-400">👨‍⚕️</span>
            </div>
          )}
        </div>

        {/* Doctor Information */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {doctor.name}
            </h1>
            <p className="text-xl text-blue-600 font-semibold mb-2">
              {doctor.specialization}
            </p>
            {doctor.degree && (
              <p className="text-lg text-gray-600 font-medium mb-4">
                {doctor.degree}
              </p>
            )}
          </div>

          {/* About Section */}
          {doctor.aboutSelf && (
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed text-base">
                {doctor.aboutSelf}
              </p>
            </div>
          )}

          {/* Experience Badge */}
          <div>
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 rounded-full">
              <span className="text-2xl font-bold text-blue-600 mr-2">
                {doctor.experience}+
              </span>
              <span className="font-semibold text-base">
                Years Experience
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}