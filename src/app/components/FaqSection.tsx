import React from "react";

interface Testimonial {
  text: string;
  author: string;
}

interface FAQ {
  question: string;
  answer: string;
  testimonial: Testimonial;
}

const FaqSection: React.FC = () => {
  const faqs: FAQ[] = [
    {
      question:
        "I'm new and don't have a business yet — will B-School work for me?",
      answer:
        "Yes! Many students start with just an idea—or no idea at all—and leave with a thriving business. Success isn't linear, but with commitment, you can achieve your vision.",
      testimonial: {
        text: "I'm thrilled that my product is now real. I have 20 testers receiving 8 Breakfast Cure bundles. My business is finally taking shape!",
        author: "KAREN TAYLOR",
      },
    },
    {
      question: "How is B-School different from other business programs?",
      answer:
        "B-School blends strategy with mindset shifts, providing actionable steps and a supportive community. With 14+ years of success across 650+ industries, it stands apart.",
      testimonial: {
        text: "No other program delivered results like B-School. The strategy and psychology approach was my breakthrough moment.",
        author: "SARAH JOHNSON",
      },
    },
    {
      question: "How much time will I need to commit each week?",
      answer:
        "Most students spend 3-5 hours per week. The program is flexible, allowing you to progress at your own pace with lifetime access.",
      testimonial: {
        text: "As a mom of three, I worried about time. But the lessons were so well-structured that I fit them into small pockets of time.",
        author: "MICHELLE RIVERA",
      },
    },
    {
      question: "Will this work for my specific industry?",
      answer:
        "Absolutely! B-School has helped entrepreneurs across 650+ industries. The principles apply to any business model with minor customizations.",
      testimonial: {
        text: "I wasn't sure if B-School would work for my legal services, but the marketing and strategy principles were highly effective.",
        author: "DAVID THOMPSON",
      },
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#FEFEFF] to-[#F4FAFF] max-w-6xl mx-auto px-6 py-16 rounded-lg shadow-lg">
      {faqs.map((faq, index) => (
        <div key={index} className="mb-12">
          <h3 className="text-3xl font-semibold text-[#0D47A1]">
            {faq.question}
          </h3>
          <p className="mt-4 text-lg bg-gradient-to-b from-[#F9FCFF] to-[#DFF3FC]">
            {faq.answer}
          </p>
          <div className="bg-[#E8F4FC] p-6 rounded-lg mt-6 shadow-md">
            <p className="text-gray-800 italic text-lg">
              &quot;{faq.testimonial.text}&quot;
            </p>
            <p className="mt-4 font-semibold text-gray-700">
              {faq.testimonial.author}
            </p>
          </div>
          {index < faqs.length - 1 && (
            <div className="w-3/4 mx-auto my-10 border-t-2 border-[#B3E5FC] opacity-50"></div>
          )}
        </div>
      ))}
    </section>
  );
};

export default FaqSection;
