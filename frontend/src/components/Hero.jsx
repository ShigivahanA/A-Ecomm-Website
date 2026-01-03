import React, { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  const placeholderImages = [
    assets.hero_img,
    assets.hero_img2 || assets.hero_img,
    "/images/placeholder-3.jpg",
  ];

  const [slides, setSlides] = useState(placeholderImages);

  // We'll append a clone of the first slide to enable smooth looping
  const slidesWithClone = slides.length ? [...slides, slides[0]] : [];

  const AUTO_PLAY_MS = 3000;
  const intervalRef = useRef(null);
  const trackRef = useRef(null);

  // positionIndex refers to position in slidesWithClone (0..n)
  const [positionIndex, setPositionIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // next and prev work on positionIndex
  const next = () => {
    if (slidesWithClone.length <= 1) return;
    setTransitionEnabled(true);
    setPositionIndex((p) => p + 1);
  };
  const prev = () => {
    if (slidesWithClone.length <= 1) return;
    setTransitionEnabled(true);
    // If we're at 0 and user calls prev, jump to last real slide first (instant), then transition to previous
    if (positionIndex === 0) {
      // jump to last real slide (index = slides.length - 1) without transition, then animate to that-1
      setTransitionEnabled(false);
      setPositionIndex(slides.length - 1);
      // in next tick enable transition and move to previous of that index
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
          setPositionIndex(slides.length - 2 >= 0 ? slides.length - 2 : 0);
        });
      });
    } else {
      setPositionIndex((p) => p - 1);
    }
  };

  // autoplay
  useEffect(() => {
    if (isPaused || slidesWithClone.length <= 1) return;
    intervalRef.current = setInterval(() => {
      next();
    }, AUTO_PLAY_MS);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, slidesWithClone.length]);

  const onMouseEnter = () => {
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  const onMouseLeave = () => setIsPaused(false);

  // handle the "jump" when we hit the cloned slide (index === slides.length)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onTransitionEnd = () => {
      // if we've moved onto the clone (last index), jump to real first slide (index 0) without animation
      if (positionIndex === slides.length) {
        // disable transition, jump to 0
        setTransitionEnabled(false);
        setPositionIndex(0);
        // force reflow and re-enable transition for subsequent moves
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTransitionEnabled(true);
          });
        });
      }
    };

    el.addEventListener("transitionend", onTransitionEnd);
    return () => el.removeEventListener("transitionend", onTransitionEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionIndex, slides.length]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionIndex, slidesWithClone.length]);

  // goTo for dots — map dot index (0..n-1) to positionIndex directly
  const goTo = (i) => {
    if (!slides.length) return;
    setTransitionEnabled(true);
    setPositionIndex(i);
  };

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Left side unchanged */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className=" font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">Latest Arrivals</h1>
          <div className="flex items-center gap-2">
            <Link to="/collection" className="font-semibold text-sm md:text-base hover:underline">
              SHOP NOW
            </Link>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>

      {/* Right side: improved infinite carousel (preserves size) */}
      <div
        className="w-full sm:w-1/2 relative overflow-hidden"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-roledescription="carousel"
      >
        <div
          ref={trackRef}
          className="flex"
          style={{
            width: `${slidesWithClone.length * 100}%`,
            transform: `translateX(-${positionIndex * (100 / slidesWithClone.length)}%)`,
            transition: transitionEnabled ? "transform 500ms ease-out" : "none",
          }}
        >
          {slidesWithClone.map((src, i) => (
            <div key={i} className="w-full" style={{ flex: `0 0 ${100 / slidesWithClone.length}%` }}>
              <img src={src} alt={`Slide ${i + 1}`} className="object-cover w-full h-auto" style={{ display: "block" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
