'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Zap, 
  ArrowRight, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  Sparkles,
  Camera,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

import { compressImage } from '@/lib/imageCompressor';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  fallbackImage?: string;
  badge: string;
  categoryQuery: string;
}

const defaultSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Rent Premium Outdoor Gear Instantly.',
    subtitle: 'Skip buying expensive equipment. Explore bikes, kayaks, camping tents, and skis from verified local owners with instant checkout.',
    image: '/hero-banner-1.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1920&q=80',
    badge: '🏕️ Camping & Wilderness Gear',
    categoryQuery: 'Camping & Hiking',
  },
  {
    id: 'slide-2',
    title: 'Conquer Any Trail With High-End Bikes.',
    subtitle: 'Find top-tier mountain bikes, road bikes, and e-bikes near you with flexible daily rates and verified safety insurance.',
    image: '/hero-banner-2.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1920&q=80',
    badge: '🚴‍♂️ Mountain Biking & Cycling',
    categoryQuery: 'Cycling & Biking',
  },
  {
    id: 'slide-3',
    title: 'Explore Rivers & Lakes With Pro Kayaks.',
    subtitle: 'Rent inflatable kayaks, paddleboards, and scuba diving gear with complete safety equipment delivered to your location.',
    image: '/hero-banner-3.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80',
    badge: '🚣‍♂️ Kayaking & Water Sports',
    categoryQuery: 'Water Sports',
  },
  {
    id: 'slide-4',
    title: 'Master The Slopes This Winter.',
    subtitle: 'Get premium skis, snowboards, and thermal winter gear delivered directly to resort pickup spots.',
    image: '/hero-banner-4.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1920&q=80',
    badge: '⛷️ Alpine Skiing & Snowboarding',
    categoryQuery: 'Winter Sports',
  },
];

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [customImageModalOpen, setCustomImageModalOpen] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Load custom image from localStorage if user previously uploaded one
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCustomImg = localStorage.getItem('gearup_custom_hero_image');
        if (savedCustomImg) {
          setSlides((prev) => [
            {
              id: 'custom-slide',
              title: 'Your Custom Hero Adventure Gear.',
              subtitle: 'Custom uploaded hero background showcasing your personalized equipment rental showcase.',
              image: savedCustomImg,
              fallbackImage: savedCustomImg,
              badge: '✨ Custom PC Uploaded Image',
              categoryQuery: 'Camping & Hiking',
            },
            ...defaultSlides,
          ]);
        }
      } catch {}
    }
  }, []);

  // Auto-play slider every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length, isAutoPlaying]);

  const handleNextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be under 10MB.');
        return;
      }
      try {
        // Compress Hero Image to 1920px max resolution with 0.85 quality for lightning fast page loads
        const compressedResult = await compressImage(file, 1920, 1080, 0.85);
        try {
          localStorage.setItem('gearup_custom_hero_image', compressedResult);
        } catch {}
        setSlides((prev) => [
          {
            id: 'custom-slide-' + Date.now(),
            title: 'Your PC Uploaded Hero Banner.',
            subtitle: 'Custom hero image uploaded directly from your local computer files!',
            image: compressedResult,
            fallbackImage: compressedResult,
            badge: '📷 Custom Uploaded Banner',
            categoryQuery: 'Camping & Hiking',
          },
          ...prev.filter((s) => !s.id.startsWith('custom-slide')),
        ]);
        setCurrentSlideIndex(0);
        setCustomImageModalOpen(false);
        toast.success('Custom Hero image compressed & uploaded successfully!');
      } catch {
        toast.error('Failed to process image file. Please try again.');
      }
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customImageUrl.trim()) return;
    try {
      localStorage.setItem('gearup_custom_hero_image', customImageUrl.trim());
    } catch {}
    setSlides((prev) => [
      {
        id: 'custom-slide-' + Date.now(),
        title: 'Your Custom Hero Image.',
        subtitle: 'Custom background image loaded from URL!',
        image: customImageUrl.trim(),
        fallbackImage: customImageUrl.trim(),
        badge: '✨ Custom Hero Banner',
        categoryQuery: 'Camping & Hiking',
      },
      ...prev.filter((s) => !s.id.startsWith('custom-slide')),
    ]);
    setCurrentSlideIndex(0);
    setCustomImageModalOpen(false);
    setCustomImageUrl('');
    toast.success('Custom Hero image applied!');
  };

  const scrollToNextSection = () => {
    const element = document.getElementById('categories-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.65, behavior: 'smooth' });
    }
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];

  return (
    <section className="relative h-[65vh] min-h-[520px] max-h-[720px] w-full overflow-hidden flex flex-col justify-between select-none">
      {/* Background Image Slider with Smooth Crossfade */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } transform transition-transform duration-10000`}
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
              className="w-full h-full object-cover object-center"
            />
            {/* Dark & Vibrant Contrast Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/65 to-slate-950/40 dark:from-slate-950/95 dark:via-slate-950/80 dark:to-slate-950/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/90" />
          </div>
        ))}
      </div>

      {/* Hero Header & Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10 sm:pt-14 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Badge & Upload Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentSlide.badge}</span>
            </div>

            <button
              type="button"
              onClick={() => setCustomImageModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold backdrop-blur-md transition-all cursor-pointer shadow-xs"
              title="Upload an image from your PC to display in the Hero section"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Upload Custom Hero Image</span>
            </button>
          </div>

          {/* Slide Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] drop-shadow-md">
            {currentSlide.title}
          </h1>

          {/* Slide Subtitle */}
          <p className="text-xs sm:text-base text-slate-200 max-w-2xl font-normal leading-relaxed drop-shadow-xs">
            {currentSlide.subtitle}
          </p>

          {/* Interactive CTAs & Search Trigger */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Link
              href={`/gear?category=${encodeURIComponent(currentSlide.categoryQuery)}`}
              className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg flex items-center space-x-2 group cursor-pointer"
            >
              <Compass className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform" />
              <span>Explore {currentSlide.categoryQuery}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/gear"
              className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Browse All Gear</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Slider Navigation & Controls Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 flex items-center justify-between">
        
        {/* Slide Indicator Dots */}
        <div className="flex items-center space-x-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentSlideIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlideIndex
                  ? 'w-8 bg-emerald-400'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Clear Visual Flow to Next Section: Pulsing Scroll Down Indicator */}
        <button
          onClick={scrollToNextSection}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-950/70 border border-slate-700/80 text-white text-xs font-bold hover:border-emerald-400 hover:text-emerald-400 transition-all cursor-pointer shadow-md group animate-bounce"
          title="Scroll to next section"
        >
          <span>Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* Slider Prev / Next Manual Arrows */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handlePrevSlide}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer backdrop-blur-md"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextSlide}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer backdrop-blur-md"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Gradient Fade Seamlessly Flowing to Next Section */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent pointer-events-none z-10" />

      {/* Modal for Custom PC Image Upload */}
      {customImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Camera className="w-5 h-5 text-emerald-500" />
                <span>Upload Custom Hero Image</span>
              </h3>
              <button
                type="button"
                onClick={() => setCustomImageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* PC File Upload Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Option 1: Choose File from PC
              </label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 bg-slate-50 dark:bg-slate-800/50 transition-all">
                <Upload className="w-8 h-8 text-emerald-500 mb-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Click to select image file from PC
                </span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP (Max 10MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">OR</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* Image URL Form */}
            <form onSubmit={handleCustomUrlSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Option 2: Paste Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomImageModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 cursor-pointer shadow-xs"
                >
                  Apply Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
