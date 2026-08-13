'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ArrowRight,
  Compass,
  Zap,
  ShieldCheck,
  Star,
  MapPin
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
      window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' });
    }
  };

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <section className="relative h-[70vh] min-h-[550px] max-h-[750px] w-full overflow-hidden select-none bg-slate-950 text-white">
      
      {/* Background Image Carousel (Full-Screen Colorful Highlighting) */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlideIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Full Width Bright Vibrant Background Image */}
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
              className="w-full h-full object-cover object-center brightness-105 contrast-105 transform scale-100 hover:scale-105 transition-transform duration-7000"
            />

            {/* Left Vignette Overlay to ensure text readability while preserving colorful background */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/70" />
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

      {/* Hero Text & Primary Action Button Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full h-full flex flex-col justify-between py-10 sm:py-14">
        <div className="my-auto max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-2xl uppercase">
            {currentSlide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-100 max-w-xl font-medium leading-relaxed drop-shadow-md">
            {currentSlide.subtitle}
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <Link
              href={`/gear?category=${encodeURIComponent(currentSlide.categoryQuery)}`}
              className="px-8 py-4 rounded-2xl text-sm font-black text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-2xl flex items-center space-x-2.5 group cursor-pointer border border-emerald-400/40 uppercase tracking-wider"
            >
              <span>{currentSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/gear"
              className="px-8 py-4 rounded-2xl text-sm font-bold text-white bg-slate-950/60 hover:bg-slate-900 border border-white/30 backdrop-blur-md transition-all shadow-xl flex items-center space-x-2 cursor-pointer uppercase tracking-wider"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Browse All 31+ Items</span>
            </Link>
          </div>
        </div>

        {/* Bottom Navigation & Scroll Down Visual Indicator Bar */}
        <div className="w-full flex items-center justify-between pt-4">
          
          {/* Slide Indicator Dots at Bottom Left */}
          <div className="flex items-center space-x-2.5">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentSlideIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'w-9 bg-white shadow-lg'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Pulsing Visual Flow Scroll Button at Bottom Center */}
          <button
            onClick={scrollToNextSection}
            className="hidden sm:flex items-center space-x-2 px-5 py-2 rounded-full bg-slate-950/80 border border-slate-700 text-white text-xs font-bold hover:border-emerald-400 hover:text-emerald-400 transition-all cursor-pointer shadow-xl group animate-bounce"
            title="Scroll to explore categories"
          >
            <span>Scroll to Explore</span>
            <ChevronDown className="w-4 h-4 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* District & Escrow Quick Pill */}
          <div className="hidden lg:flex items-center space-x-2 text-xs font-bold text-slate-200 bg-slate-950/80 px-4 py-2 rounded-full border border-slate-800 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Stripe Escrow Payment</span>
          </div>
        </div>
      </div>

      {/* Seamless Bottom Gradient Fade Flow into Categories */}
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent pointer-events-none z-10" />
    </section>
  );
}
