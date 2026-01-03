import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import CustomDesign from '../components/CustomDesign'

const Home = () => {
  const { homeBanner } = useContext(ShopContext);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (homeBanner?.bannerActive && homeBanner?.bannerImage) {
      setShowBanner(true);
    }
  }, [homeBanner]);

  return (
    <div>
      {/* ================= HOME BANNER MODAL ================= */}
      {showBanner && (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={() => setShowBanner(false)}
    />

    {/* IMAGE WRAPPER — THIS IS THE KEY FIX */}
    <div className="relative z-10 inline-block max-h-[80vh] max-w-[90vw]">
      
      <img
        src={homeBanner.bannerImage}
        alt="Offer banner"
        className="
          block
          max-h-[80vh]
          max-w-[90vw]
          h-auto
          w-auto
          rounded-xl
          shadow-2xl
        "
      />

      {/* Close button — now truly on the image */}
      <button
        onClick={() => setShowBanner(false)}
        className="
          absolute 
          top-2 
          right-2
          w-9 
          h-9 
          rounded-full 
          bg-black/70 
          text-white 
          flex 
          items-center 
          justify-center 
          text-xl 
          hover:bg-black
        "
        aria-label="Close banner"
      >
        ×
      </button>
    </div>
  </div>
)}


      {/* ================= PAGE CONTENT ================= */}
      <Hero />
      <LatestCollection />
      <BestSeller />
      <CustomDesign />
      <OurPolicy />
      <NewsletterBox />
    </div>
  )
}

export default Home;
