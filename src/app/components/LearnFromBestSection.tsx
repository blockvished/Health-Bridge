import React from "react";

const LearnFromBestSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 text-white flex flex-col lg:flex-row items-center">
      {/* Text Section */}
      <div className="w-full lg:w-1/2 p-8 text-center lg:text-left">
        <h2 className="text-4xl font-extrabold leading-tight">
          Learn From <span className="text-yellow-300">The Best</span>
        </h2>
        <p className="mt-4 text-lg leading-relaxed">
          B-School is led by <span className="font-semibold">Marie Forleo</span>
          , a <span className="italic">#1 New York Times</span> best-selling
          author of <em>Everything is Figureoutable</em> and creator of the
          award-winning show <span className="font-semibold">MarieTV</span>.
          <br />
          <br />
          Named by <span className="font-semibold">Oprah</span> as a thought
          leader, Marie’s mission is to help you unlock your full potential and
          use your gifts to change the world.
        </p>
      </div>

      {/* Image Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-300">
        <img
          src="/RIGHT.webp"
          alt="Marie Forleo"
          className="w-full max-h-[450px] object-cover rounded-lg shadow-xl"
        />
      </div>
    </section>
  );
};

export default LearnFromBestSection;
