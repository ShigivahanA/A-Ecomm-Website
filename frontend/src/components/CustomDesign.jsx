import React from "react";
import { Link } from "react-router-dom";
import Title from './Title';

export default function CustomDesign() {
  return (
    <section className="w-full bg-white py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Title & description */}
        <div className='text-center text-3xl py-5'>
        <Title text1={'CUSTOM-MADE'} text2={'DESIGNS'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        Want a piece made just for you? Tell us your vision — fabrics, silhouette, measurements,
            and any reference images. Our atelier will review your requirements and get back with a
            quote and timeline. We specialise in handcrafted pieces tailored to your style.
        </p>
      </div>

        {/* CTA + subtle secondary link */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/custom-design"
            className="px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:opacity-95 transition"
            aria-label="Request custom design"
          >
            Request a custom design
          </Link>
        </div>
      </div>
    </section>
  );
}
