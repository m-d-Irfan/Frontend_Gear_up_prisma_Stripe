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
  Search,
  MapPin,
  ShieldCheck,
  Star
} from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  fallbackImage: string;
  categoryQuery: string;
  highlightText: string;
  tagline: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Rent Premium Outdoor Gear',
    highlightText: 'Instantly.',
    subtitle: 'Skip buying expensive equipment. Explore bikes, kayaks, camping tents, and climbing gear from verified local owners across Bangladesh.',
    image: '/hero-banner-1.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1920&q=80',
    categoryQuery: 'Camping & Hiking',
    tagline: 'Wilderness Camping Gear',
  },
  {
    id: 'slide-2',
    title: 'Conquer Any Trail With',
    highlightText: 'Pro Bikes.',
    subtitle: 'Find top-tier mountain bikes, road bikes, and e-bikes near you with flexible daily rates and verified safety insurance.',
    image: '/hero-banner-2.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1920&q=80',
    categoryQuery: 'Cycling & Biking',
    tagline: 'Mountain Biking Equipment',
  },
  {
    id: 'slide-3',
    title: 'Explore Rivers & Lakes With',
    highlightText: 'Pro Kayaks.',
    subtitle: 'Rent inflatable kayaks, paddleboards, and scuba diving gear with complete safety equipment delivered directly to your spot.',
    image: '/hero-banner-3.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80',
    categoryQuery: 'Water Sports',
    tagline: 'Kayaking & Water Sports',
  },
  {
    id: 'slide-4',
    title: 'Master Summit Treks With',
    highlightText: 'Alpine Gear.',
    subtitle: 'Get premium climbing boots, snow shoes, backpacks, and thermal winter gear thoroughly inspected and prepped for adventure.',
    image: '/hero-banner-4.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1920&q=80',
    categoryQuery: 'Winter Sports',
    tagline: 'Alpine Expedition Equipment',
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
    <section className="relative h-[65vh] min-h-[540px] max-h-[720px] w-full overflow-hidden flex flex-col justify-between select-none bg-slate-950 text-white">
      
      {/* Soft Ambient Background Layer */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentSlide.image}
          alt={currentSlide.title}
          onError={(e) => {
            const target = e.currentTarget;
            if (currentSlide.fallbackImage && target.src !== currentSlide.fallbackImage) {
              target.src = currentSlide.fallbackImage;
            }
          }}
          className="w-full h-full object-cover blur-xl transform scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
      </div>

      {/* Main 2-Column Split Hero Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 sm:pt-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Title, Subtitle, Search & CTAs */}
          <div className="lg:col-span-7 space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
            
            {/* Eye-Catching Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.12] drop-shadow-md">
              {currentSlide.title}{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {currentSlide.highlightText}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              {currentSlide.subtitle}
            </p>

            {/* Interactive Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-1 max-w-xl">
              <div className="relative flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl focus-within:border-emerald-400 transition-all">
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
                className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all shadow-md flex items-center space-x-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Browse Catalog</span>
              </Link>
            </div>
          </div>

          {/* Right Column: HIGHLIGHTED Full-Fidelity Hero Image Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 bg-slate-900 group">
              
              {/* Highlighted Crisp Hero Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (currentSlide.fallbackImage && target.src !== currentSlide.fallbackImage) {
                    target.src = currentSlide.fallbackImage;
                  }
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-105 contrast-105"
              />

              {/* Top Tagline Badge */}
              <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-[11px] font-bold text-emerald-300 shadow-md">
                ✨ {currentSlide.tagline}
              </div>

              {/* Bottom Carousel Thumbnail Bar */}
              <div className="absolute bottom-3 inset-x-3 bg-slate-950/85 backdrop-blur-md p-2 rounded-2xl border border-slate-800 flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-1.5">
                  {HERO_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setCurrentSlideIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentSlideIndex
                          ? 'w-6 bg-emerald-400'
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handlePrevSlide}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Trust Badges Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-1">
        <div className="hidden sm:flex items-center justify-between bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl px-6 py-2 shadow-lg text-xs font-semibold text-slate-300">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Stripe Payment Escrow Guarantee</span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>4.9 Rating Verified Customer Reviews</span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>64 Bangladesh Districts Outlets</span>
          </div>
        </div>
      </div>

      {/* Clear Visual Flow Arrow to Next Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-3 flex items-center justify-center">
        <button
          onClick={scrollToNextSection}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-white text-xs font-bold hover:border-emerald-400 hover:text-emerald-400 transition-all cursor-pointer shadow-md group animate-bounce"
          title="Scroll down to categories"
        >
          <span>Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Seamless Bottom Gradient Fade Flow */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent pointer-events-none z-10" />
    </section>
  );
}
