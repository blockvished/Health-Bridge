import React from "react";

const MediaFeaturesSection: React.FC = () => {
  const mediaImages = [
    "/1.jpg",
    "/2.png",
    "/3.png",
    "/4.png",
    "/5.png",
    "/6.jpg",
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black text-white text-center">
      {/* Title */}
      <h2 className="text-lg uppercase tracking-widest font-bold text-gray-300 mb-4">
        You Might Have Seen Me On
      </h2>

      {/* Featured Media Text */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-lg font-semibold text-gray-100">
        {["Forbes", "The New York Times", "Today", "Oprah", "People"].map(
          (media, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-800 rounded-md shadow-md"
            >
              {media}
            </span>
          )
        )}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 mt-8 max-w-5xl mx-auto">
        {mediaImages.map((src, index) => (
          <div key={index} className="group overflow-hidden rounded-lg shadow-lg">
            <img
              src={src}
              className="w-full h-auto rounded-lg transform transition duration-300 group-hover:scale-105 group-hover:shadow-xl"
              alt={`Featured media ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MediaFeaturesSection;
