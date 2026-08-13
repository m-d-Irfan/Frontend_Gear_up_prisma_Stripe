'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  Zap, 
  ArrowRight, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Flame
} from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  fallbackImage: string;
  badge: string;
  categoryQuery: string;
  highlightText: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Rent Premium Outdoor Gear',
    highlightText: 'Instantly.',
    subtitle: 'Skip buying expensive equipment. Explore bikes, kayaks, camping tents, and climbing gear from verified local owners across Bangladesh.',
    image: '/hero-banner-1.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1920&q=80',
    badge: '🏕️ Camping & Wilderness Gear',
    categoryQuery: 'Camping & Hiking',
  },
  {
    id: 'slide-2',
    title: 'Conquer Any Trail With',
    highlightText: 'Pro Bikes.',
    subtitle: 'Find top-tier mountain bikes, road bikes, and e-bikes near you with flexible daily rates and verified safety insurance.',
    image: '/hero-banner-2.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1920&q=80',
    badge: '🚴‍♂️ Mountain Biking & Cycling',
    categoryQuery: 'Cycling & Biking',
  },
  {
    id: 'slide-3',
    title: 'Explore Rivers & Lakes With',
    highlightText: 'Pro Kayaks.',
    subtitle: 'Rent inflatable kayaks, paddleboards, and scuba diving gear with complete safety equipment delivered directly to your spot.',
    image: '/hero-banner-3.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80',
    badge: '🚣‍♂️ Kayaking & Water Sports',
    categoryQuery: 'Water Sports',
  },
  {
    id: 'slide-4',
    title: 'Master Summit Treks With',
    highlightText: 'Alpine Gear.',
    subtitle: 'Get premium climbing boots, snow shoes, backpacks, and thermal winter gear thoroughly inspected and prepped for adventure.',
    image: '/hero-banner-4.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1920&q=80',
    badge: '⛷️ Alpine & Winter Exploration',
    categoryQuery: 'Winter Sports',
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-play slider every 5.5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/gear?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/gear');
    }
  };

  const scrollToNextSection = () => {
    const element = document.getElementById('categories-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.65, behavior: 'smooth' });
    }
  };

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <section className="relative h-[65vh] min-h-[540px] max-h-[720px] w-full overflow-hidden flex flex-col justify-between select-none">
      
      {/* Background Image Carousel with Rich Overlays */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlideIndex
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            {/* Background Image */}
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
              className="w-full h-full object-cover object-center transform transition-transform duration-10000 hover:scale-110"
            />
            {/* Vignette & Ambient Glow Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90" />
            <div className="absolute inset-0 bg-radial at-top-left from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Main Hero Header & Interactive Search Box */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10 sm:pt-14 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Glowing Badge Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentSlide.badge}</span>
          </div>

          {/* Eye-Catching Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] drop-shadow-lg">
            {currentSlide.title}{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              {currentSlide.highlightText}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base text-slate-200 max-w-2xl font-normal leading-relaxed drop-shadow-sm">
            {currentSlide.subtitle}
          </p>

          {/* Interactive Floating Hero Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl">
            <div className="relative flex items-center bg-slate-950/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl focus-within:border-emerald-400 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search kayaks, mountain bikes, tents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer flex-shrink-0 flex items-center space-x-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Filter Tag Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2.5 text-[11px] text-slate-300">
              <span className="font-semibold text-slate-400">Popular:</span>
              <button
                type="button"
                onClick={() => router.push('/gear?category=Cycling%20%26%20Biking')}
                className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
              >
                🚴‍♂️ Biking
              </button>
              <button
                type="button"
                onClick={() => router.push('/gear?category=Water%20Sports')}
                className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
              >
                🚣‍♂️ Kayaking
              </button>
              <button
                type="button"
                onClick={() => router.push('/gear?category=Camping%20%26%20Hiking')}
                className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
              >
                ⛺ Camping
              </button>
            </div>
          </form>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/gear?category=${encodeURIComponent(currentSlide.categoryQuery)}`}
              className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-xl flex items-center space-x-2 group cursor-pointer"
            >
              <Compass className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform" />
              <span>Explore {currentSlide.categoryQuery}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/gear"
              className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Browse All 31+ Items</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Trust Badges Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-2">
        <div className="hidden sm:flex items-center justify-between bg-slate-950/75 backdrop-blur-md border border-slate-800 rounded-2xl px-6 py-2.5 shadow-lg text-xs font-semibold text-slate-300">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Stripe Payment Escrow Guarantee</span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>4.9 Rating Verified Customer Reviews</span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>64 Bangladesh Districts Pickup Outlets</span>
          </div>
        </div>
      </div>

      {/* Slider Controls & Clear Flow Arrow to Next Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 flex items-center justify-between">
        
        {/* Progress Dots */}
        <div className="flex items-center space-x-2">
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentSlideIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlideIndex
                  ? 'w-8 bg-emerald-400 shadow-md'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Clear Visual Flow to Next Section */}
        <button
          onClick={scrollToNextSection}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-950/80 border border-slate-700 text-white text-xs font-bold hover:border-emerald-400 hover:text-emerald-400 transition-all cursor-pointer shadow-md group animate-bounce"
          title="Scroll down to categories"
        >
          <span>Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* Manual Arrow Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handlePrevSlide}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer backdrop-blur-md shadow-md"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextSlide}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer backdrop-blur-md shadow-md"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Seamless Bottom Gradient Fade Flow */}
      <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent pointer-events-none z-10" />
    </section>
  );
}
