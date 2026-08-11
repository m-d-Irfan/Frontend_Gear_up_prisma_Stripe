'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate contact form submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Thank you! Your message has been received.');
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
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Contact Channels</span>
            </h3>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Support</p>
                  <p className="text-slate-500 dark:text-slate-400">support@gearup.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Helpline Hotline</p>
                  <p className="text-slate-500 dark:text-slate-400">+880 1700-000000</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
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
            <p className="text-[11px] text-emerald-400 font-semibold">Instant response within 2 business hours.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Thank you for contacting GearUp. Our support team will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Send Us a Direct Inquiry</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Your Name *
                  </label>
                  <input
                    {...register('name')}
                    id="contact-name"
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
                  />
                  {errors.name && <p className="text-xs text-rose-600 font-semibold">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Your Email *
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
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Subject *
                </label>
                <input
                  {...register('subject')}
                  id="contact-subject"
                  type="text"
                  placeholder="Inquiry about outdoor equipment rentals..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
                />
                {errors.subject && <p className="text-xs text-rose-600 font-semibold">{errors.subject.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Message *
                </label>
                <textarea
                  {...register('message')}
                  id="contact-message"
                  rows={4}
                  placeholder="Describe your inquiry in detail..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500 resize-none"
                />
                {errors.message && <p className="text-xs text-rose-600 font-semibold">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 cursor-pointer transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
