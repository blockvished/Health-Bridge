import React from "react";

const FooterFormSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-[#DFF3FC] to-[#F9FCFF] text-center">
      <h2 className="text-3xl font-bold text-gray-900">
        When does B-School start?
      </h2>
      <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
        <strong>B-School doors open on February 13th, 2025!</strong> Put your
        name and email on the VIP waitlist below so you get first dibs when
        doors reopen. Plus, I'll send you my brand new free guide:
        <strong className="text-[#1565C0]">
          {" "}
          12 Entrepreneurial Mistakes You Can't Afford to Make in 2025.
        </strong>
        So you can stop struggling and start seeing results in your business.
      </p>

      <form className="mt-8 bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto border border-gray-200">
        <input
          type="text"
          placeholder="First Name"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#64B5F6] mb-4 transition duration-300"
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#64B5F6] mb-4 transition duration-300"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] hover:from-[#1976D2] hover:to-[#1565C0] text-white py-3 px-6 w-full rounded-md font-semibold text-lg transition duration-300 shadow-md"
        >
          Get My Free Guide
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-600 max-w-md mx-auto">
        By entering your info, you'll become an MF Insider — with FREE access to
        exclusive insights, private Q+As, and inspiring episodes of MarieTV,
        delivered with love to your inbox. (Unsub anytime in a click.) You also
        agree to our{" "}
        <a
          href="#"
          className="underline text-[#1976D2] hover:text-[#1565C0] transition duration-300"
        >
          Terms of Use
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline text-[#1976D2] hover:text-[#1565C0] transition duration-300"
        >
          Privacy Policy
        </a>
        .
      </p>
    </section>
  );
};

export default FooterFormSection;
