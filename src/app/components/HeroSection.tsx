import React from "react";
import WaitlistForm from "./WaitlistForm";
import Image from "next/image";

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-8 lg:min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-teal-200 to-blue-50">
      <div className="container mx-auto flex flex-col lg:flex-row items-center w-full h-full">
        {/* Image Section */}
        <div className="relative w-full lg:w-1/2 h-full lg:h-[95vh]">
          <Image
            src="/hero.webp"
            alt="Hero Image"
            className="rounded-lg shadow-lg object-cover"
            layout="fill"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 lg:pl-12 flex flex-col justify-center p-6 text-center lg:text-left">
          <h3 className="text-sm uppercase font-semibold text-teal-600 animate-fadeIn">
            B-SCHOOL IS COMING SOON!
          </h3>
          <h1 className="text-5xl font-bold mt-2 leading-tight text-gray-900 animate-fadeIn delay-100">
            Join the VIP Waitlist & Get My 2025 Success Guide!
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-lg animate-fadeIn delay-200">
            {`Don't miss out! Join the VIP waitlist now to get first dibs when
            B-School reopens on February 13th, 2025. Plus, you'll get instant
            access to my NEW Free Guide:`}
            <span className="font-semibold">
              {`12 Mistakes You Can't Afford to Make in 2025.`}
            </span>
          </p>

          {/* Waitlist Form */}
          <div className="animate-fadeIn delay-300">
            <WaitlistForm />
          </div>

          <p className="mt-4 text-xs text-gray-600 max-w-lg animate-fadeIn delay-400">
            {`By entering your info, you'll become an MF Insider — with FREE
            access to exclusive insights, private Q+As, and inspiring episodes
            of MarieTV, delivered with love to your inbox. (Unsub anytime in a
            click.) You also agree to our`}
            <a href="#" className="underline hover:text-teal-600 transition">
              Terms of Use
            </a>
            and
            <a href="#" className="underline hover:text-teal-600 transition">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
