'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ArrowRight,
  Zap
} from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  fallbackImage: string;
  ctaText: string;
  categoryQuery: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'RENT PREMIUM OUTDOOR GEAR',
    subtitle: 'Skip buying expensive equipment. Explore kayaks, bikes, tents, and climbing gear from verified local owners across Bangladesh.',
    image: '/hero-banner-1.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1920&q=80',
    ctaText: 'EXPLORE CATALOG',
    categoryQuery: 'Camping & Hiking',
  },
  {
    id: 'slide-2',
    title: 'CONQUER TRAILS WITH PRO BIKES',
    subtitle: 'Find top-tier mountain bikes, road bikes, and e-bikes near you with flexible daily rates and verified safety insurance.',
    image: '/hero-banner-2.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1920&q=80',
    ctaText: 'RENT MOUNTAIN BIKES',
    categoryQuery: 'Cycling & Biking',
  },
  {
    id: 'slide-3',
    title: 'EXPLORE RIVERS WITH PRO KAYAKS',
    subtitle: 'Rent inflatable kayaks, paddleboards, and scuba diving gear with complete safety equipment delivered directly to your spot.',
    image: '/hero-banner-3.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80',
    ctaText: 'RENT KAYAKS & BOATS',
    categoryQuery: 'Water Sports',
  },
  {
    id: 'slide-4',
    title: 'MASTER SUMMIT TREKS THIS SEASON',
    subtitle: 'Get premium climbing boots, snow shoes, backpacks, and thermal winter gear thoroughly inspected and prepped for adventure.',
    image: '/hero-banner-4.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1920&q=80',
    ctaText: 'EXPLORE ALPINE GEAR',
    categoryQuery: 'Winter Sports',
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play slider every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const scrollToNextSection = () => {
    const element = document.getElementById('categories-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  };

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <section className="relative h-[80vh] min-h-[620px] max-h-[820px] w-full overflow-hidden select-none bg-slate-950 text-white">
      
      {/* Background Image Carousel (Ultra Vibrant Full-Screen Display) */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlideIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Full Width Vivid High-Brightness Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.title}
              onError={(e) => {
                const target = e.currentTarget;
                if (slide.fallbackImage && target.src !== slide.fallbackImage) {
                  target.src = slide.fallbackImage;
                }
              }}
              className="w-full h-full object-cover object-center brightness-110 contrast-105 transform scale-100 hover:scale-105 transition-transform duration-7000"
            />

            {/* Vignette Overlay — stronger left side for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
          </div>
        ))}
      </div>

      {/* Floating Left Arrow Button */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-slate-900 hover:bg-slate-100 hover:scale-110 transition-all shadow-2xl flex items-center justify-center cursor-pointer group"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 stroke-[3] group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Floating Right Arrow Button */}
      <button
        onClick={handleNextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-slate-900 hover:bg-slate-100 hover:scale-110 transition-all shadow-2xl flex items-center justify-center cursor-pointer group"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Hero Text & CTA Buttons Container */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full pb-16 sm:pb-20 md:pb-24">
          {/* Headline — responsive: smaller on mobile */}
          <h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] sm:leading-[1.1] uppercase max-w-2xl"
            style={{ textShadow: '2px 3px 12px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.4)' }}
          >
            {currentSlide.title}
          </h1>

          {/* Subtitle — responsive: compact and clean on mobile */}
          <p
            className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs md:text-sm text-slate-200 max-w-lg font-medium leading-relaxed"
            style={{ textShadow: '1px 1px 8px rgba(0,0,0,0.8)' }}
          >
            {currentSlide.subtitle}
          </p>

          {/* CTA Buttons — Identical on all slides, hidden on mobile screens */}
          <div className="hidden sm:flex items-center gap-3.5 mt-5 sm:mt-6">
            <Link
              href="/gear"
              className="px-6 py-3 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-xl flex items-center space-x-2 group cursor-pointer border border-emerald-400/40 uppercase tracking-wider"
            >
              <span>Explore Gear Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/gear"
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-slate-950/70 hover:bg-slate-900 border border-white/25 backdrop-blur-md transition-all shadow-lg flex items-center space-x-2 cursor-pointer uppercase tracking-wider"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Browse All Items</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar — dots */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full pb-5 sm:pb-6 flex items-center justify-between relative z-10">
          {/* Slide Indicator Dots */}
          <div className="flex items-center space-x-2.5">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentSlideIndex(idx);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'w-8 bg-emerald-400 shadow-lg shadow-emerald-400/40'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Highlighted Animated Scroll to Explore Button — Centered & Fully Responsive */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <button
          onClick={scrollToNextSection}
          className="flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-slate-950/90 hover:bg-emerald-600 border border-emerald-400/60 hover:border-emerald-300 text-emerald-300 hover:text-white shadow-2xl shadow-emerald-950/80 hover:shadow-emerald-500/30 backdrop-blur-md transition-all cursor-pointer group animate-bounce"
          title="Scroll to explore categories"
        >
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">Scroll to Explore</span>
          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 group-hover:text-white group-hover:translate-y-0.5 transition-all" />
        </button>
      </div>

      {/* Subtle Bottom Transition Line */}
      <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent pointer-events-none z-10" />
    </section>
  );
}
