import React from "react";

const testimonials = [
  {
    name: "Sophia Martinez",
    position: "Founder, Luxe Design Studio",
    text: "B-School transformed my business! I now earn 10x more and have true time freedom.",
    image: "/REVIEW.jpg",
  },
  {
    name: "James Carter",
    position: "CEO, GrowthHub Marketing",
    text: "The strategies I learned helped me land my dream clients consistently.",
    image: "/REVIEW.jpg",
  },
  {
    name: "Elena Roberts",
    position: "Co-Founder, EcoEssentials",
    text: "I tripled my revenue in one year after implementing B-School strategies.",
    image: "/REVIEW.jpg",
  },
  {
    name: "Mark Lewis",
    position: "Founder, Freelance Mastery",
    text: "From side-hustle to full-time business in just 6 months after B-School.",
    image: "/REVIEW.jpg",
  },
  {
    name: "Natasha Singh",
    position: "Online Course Creator",
    text: "B-School gave me the confidence to finally launch my online courses.",
    image: "/REVIEW.jpg",
  },
  {
    name: "Dylan Foster",
    position: "E-commerce Entrepreneur",
    text: "Best investment I've ever made. Highly recommend it to every entrepreneur.",
    image: "/REVIEW.jpg",
  },
];

// Testimonials Section
const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#FAF5E8] to-[#F3E8D5] text-center">
      {/* Section Title */}
      <h2 className="text-4xl font-extrabold text-gray-900">
        B-School Works. <span className="text-teal-600">{`Here's Proof.`}</span>
      </h2>
      <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
        {`14 years, nearly 80,000 students from 650+ industries worldwide. There's
        a reason we're the gold standard in this industry.`}
      </p>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
};

// Testimonial Card Component
const TestimonialCard: React.FC<{ testimonial: (typeof testimonials)[0] }> = ({
  testimonial,
}) => {
  return (
    <div className="bg-[#FEF8F2] p-6 shadow-lg rounded-xl border border-gray-200 transition-transform transform hover:scale-[1.03] hover:shadow-xl duration-300">
      {/* Reviewer Info */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={testimonial.image}
          alt={`Photo of ${testimonial.name}`}
          className="w-14 h-14 rounded-full border border-gray-300 object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-600">{testimonial.position}</p>
        </div>
      </div>

      {/* Star Rating (Centered) */}
      <div
        className="flex justify-center gap-1 text-yellow-500 text-lg"
        aria-label="5-star rating"
      >
        {"★★★★★".split("").map((star, i) => (
          <span key={i}>{star}</span>
        ))}
      </div>

      {/* Testimonial Text */}
      <blockquote className="mt-3 text-gray-800 italic text-center">
      &apos;{testimonial.text}&apos;
      </blockquote>
    </div>
  );
};

export default TestimonialsSection;
