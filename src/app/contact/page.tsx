'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, MessageSquare, PhoneCall, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

const contactSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactMode, setContactMode] = useState<'email' | 'whatsapp'>('email');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    if (contactMode === 'email' && (!data.email || !data.email.trim())) {
      toast.error('Please enter your email address.');
      return;
    }
    if (contactMode === 'whatsapp' && (!data.phone || !data.phone.trim())) {
      toast.error('Please enter your WhatsApp / phone number.');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);

    if (contactMode === 'whatsapp') {
      const whatsappText = `Hi GearUp Support! 👋\n\n*WhatsApp Number:* ${data.phone}\n\n*Message:*\n${data.message}`;
      const whatsappUrl = `https://wa.me/8801611836864?text=${encodeURIComponent(whatsappText)}`;
      window.open(whatsappUrl, '_blank');
      toast.success('Redirecting to WhatsApp...');
    } else {
      // Browser Gmail Compose Link
      const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=grabgear4100@gmail.com&su=${encodeURIComponent(
        'Inquiry from GrabGear Website'
      )}&body=${encodeURIComponent(`Sender Email: ${data.email}\n\nMessage:\n${data.message}`)}`;
      
      const mailtoUrl = `mailto:grabgear4100@gmail.com?subject=${encodeURIComponent(
        'Inquiry from GrabGear Website'
      )}&body=${encodeURIComponent(`Sender Email: ${data.email}\n\nMessage:\n${data.message}`)}`;

      try {
        const opened = window.open(gmailComposeUrl, '_blank');
        if (!opened) {
          window.location.href = mailtoUrl;
        }
      } catch {
        window.location.href = mailtoUrl;
      }
      toast.success('Opening Gmail compose in browser...');
    }

    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Get in Touch With <span className="text-emerald-600 dark:text-emerald-400">GearUp</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Have questions about renting gear, becoming a provider, or customer support? Send us a message!
        </p>
      </div>

      {/* Grid: Contact Info vs Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information Cards */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Contact Channels</span>
            </h3>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              {/* Email Link */}
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Support</p>
                  <a
                    href="mailto:grabgear4100@gmail.com"
                    className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold flex items-center space-x-1"
                  >
                    <span>grabgear4100@gmail.com</span>
                    <ArrowUpRight className="w-3 h-3 inline" />
                  </a>
                </div>
              </div>

              {/* Phone Link */}
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Helpline Hotline</p>
                  <a
                    href="tel:+8801611836864"
                    className="text-slate-700 dark:text-slate-200 hover:text-emerald-600 font-semibold flex items-center space-x-1"
                  >
                    <span>+880 1611-836864</span>
                    <ArrowUpRight className="w-3 h-3 inline" />
                  </a>
                </div>
              </div>

              {/* WhatsApp Direct Chat */}
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">WhatsApp Support</p>
                  <a
                    href="https://wa.me/8801611836864"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Chat on WhatsApp (+8801611836864)</span>
                    <ArrowUpRight className="w-3 h-3 inline" />
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Headquarters</p>
                  <p className="text-slate-500 dark:text-slate-400">Gulshan-2, Dhaka 1212, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-emerald-950 text-white p-6 rounded-3xl space-y-2 shadow-md">
            <p className="text-sm font-bold">Support Operating Hours</p>
            <p className="text-xs text-slate-300">Monday - Saturday: 9:00 AM - 8:00 PM</p>
            <p className="text-[11px] text-emerald-400 font-semibold">Staff checks & replies within 72 hours.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Send Us a Direct Inquiry</h2>
                {/* Reply Method Selector */}
                <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold w-fit">
                  <button
                    type="button"
                    onClick={() => setContactMode('email')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      contactMode === 'email'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Email Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMode('whatsapp')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      contactMode === 'whatsapp'
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    WhatsApp Reply
                  </button>
                </div>
              </div>

              {/* Mode 1: Email Reply (Shows ONLY Email field) */}
              {contactMode === 'email' && (
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Your Email Address *
                  </label>
                  <input
                    {...register('email')}
                    id="contact-email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
                  />
                  {errors.email && <p className="text-xs text-rose-600 font-semibold">{errors.email.message}</p>}
                </div>
              )}

              {/* Mode 2: WhatsApp Reply (Shows ONLY Phone/Number field) */}
              {contactMode === 'whatsapp' && (
                <div className="space-y-1.5">
                  <label htmlFor="contact-phone" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    {...register('phone')}
                    id="contact-phone"
                    type="text"
                    placeholder="+8801700000000"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
                  />
                  {errors.phone && <p className="text-xs text-rose-600 font-semibold">{errors.phone.message}</p>}
                </div>
              )}

              {/* Message Field */}
              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Message *
                </label>
                <textarea
                  {...register('message')}
                  id="contact-message"
                  rows={5}
                  placeholder="Describe your inquiry in detail..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500 resize-none"
                />
                {errors.message && <p className="text-xs text-rose-600 font-semibold">{errors.message.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 cursor-pointer transition-all mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
        </div>
      </div>
    </div>
  );
}
