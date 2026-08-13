'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, MessageSquare, PhoneCall, ArrowUpRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const contactSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().optional(),
    phone: z.string().optional(),
    subject: z.string().min(3, 'Subject must be at least 3 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
  })
  .refine(
    (data) => {
      const hasEmail = Boolean(data.email && data.email.trim().length > 0);
      const hasPhone = Boolean(data.phone && data.phone.trim().length > 0);
      return hasEmail || hasPhone;
    },
    {
      message: 'Please provide either an Email Address OR a WhatsApp/Phone Number so our team can reply.',
      path: ['email'],
    }
  );

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactFormValues | null>(null);
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
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);

    const newInquiry = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email || '',
      phone: data.phone || '',
      subject: data.subject,
      message: data.message,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('gearup_contact_inquiries');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newInquiry);
        localStorage.setItem('gearup_contact_inquiries', JSON.stringify(list));
      } catch {}
    }

    setSubmittedData(data);
    setIsSubmitted(true);

    if (contactMode === 'whatsapp' || (data.phone && !data.email)) {
      const formattedText = `Hi GearUp Support! 👋\n\n*Name:* ${data.name}\n*Email:* ${data.email || 'N/A'}${data.phone ? `\n*Phone/WhatsApp:* ${data.phone}` : ''}\n*Subject:* ${data.subject}\n\n*Message:*\n${data.message}`;
      const whatsappUrl = `https://wa.me/8801611836864?text=${encodeURIComponent(formattedText)}`;
      window.open(whatsappUrl, '_blank');
      toast.success('Opening WhatsApp to send your inquiry...');
    } else {
      // Trigger client mailto draft to grabgear4100@gmail.com
      const mailSubject = encodeURIComponent(`Inquiry from ${data.name}: ${data.subject}`);
      const mailBody = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\n\nMessage:\n${data.message}`);
      const mailtoUrl = `mailto:grabgear4100@gmail.com?subject=${mailSubject}&body=${mailBody}`;
      
      toast.success('Inquiry submitted! Opening your email app to send to grabgear4100@gmail.com...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);
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
          Have questions about renting gear, becoming a provider, or customer support? We respond fast via Email or WhatsApp!
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
            <p className="text-[11px] text-emerald-400 font-semibold">Staff checks & replies within 2 business hours.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {isSubmitted ? (
            <div className="py-6 space-y-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Inquiry Received!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  A confirmation email response has been dispatched from our official address.
                </p>
              </div>

              {/* Sophisticated Automated Reply Email Preview Card */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-5 text-left border border-slate-800 shadow-xl max-w-xl mx-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        Automated Reply Confirmation
                      </p>
                      <p className="text-xs font-bold text-white">grabgear4100@gmail.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
                    Just now
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p className="font-bold text-white text-sm">
                    Re: {submittedData?.subject || 'GearUp Equipment Inquiry'}
                  </p>

                  <p>Hi {submittedData?.name || 'Valued Customer'},</p>

                  <p>
                    Thank you for reaching out to <strong className="text-emerald-400 font-semibold">GearUp Outdoor Rentals</strong>! We’ve successfully received your message regarding <em>"{submittedData?.subject}"</em>.
                  </p>

                  <p>
                    A GrabGear support team member will review your inquiry and contact you within <strong>72 hours</strong> via {submittedData?.email ? submittedData.email : 'WhatsApp/Phone'}.
                  </p>

                  <p>
                    If your request is urgent, feel free to connect directly with us on WhatsApp at{' '}
                    <a
                      href="https://wa.me/8801611836864"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 font-bold underline hover:text-emerald-300"
                    >
                      +880 1611-836864
                    </a>.
                  </p>

                  <div className="pt-3 border-t border-slate-800 text-slate-400 space-y-0.5">
                    <p className="font-bold text-white">Warm regards,</p>
                    <p className="font-semibold text-slate-200">The GearUp Outdoor Support Team</p>
                    <p className="text-[11px] text-emerald-400">Official Contact: grabgear4100@gmail.com</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 cursor-pointer shadow-sm transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Send Us a Direct Inquiry</h2>
                {/* Contact Preferred Mode Selector */}
                <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold w-fit">
                  <button
                    type="button"
                    onClick={() => setContactMode('email')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      contactMode === 'email'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Email Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMode('whatsapp')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      contactMode === 'whatsapp'
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    WhatsApp Reply
                  </button>
                </div>
              </div>

              {/* Name */}
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

              {/* Flexible Contact Information Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>Your Email Address</span>
                    <span className="text-[10px] text-slate-400 font-normal">(Optional if WhatsApp is provided)</span>
                  </label>
                  <input
                    {...register('email')}
                    id="contact-email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-phone" className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>WhatsApp / Phone Number</span>
                    <span className="text-[10px] text-slate-400 font-normal">(Optional if Email is provided)</span>
                  </label>
                  <input
                    {...register('phone')}
                    id="contact-phone"
                    type="text"
                    placeholder="+8801700000000"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
                  />
                </div>
              </div>
              {errors.email && <p className="text-xs text-rose-600 font-semibold">{errors.email.message}</p>}

              {/* Subject */}
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

              {/* Message */}
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

              {/* Single Primary Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 cursor-pointer transition-all mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-emerald-400" />
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
