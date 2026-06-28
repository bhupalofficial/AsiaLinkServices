import React, { useState } from "react";
import { 
  Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle
} from "lucide-react";
import { CMSData, AppTheme } from "../types";

interface ContactViewProps {
  cmsData: CMSData;
  theme: AppTheme;
}

export default function ContactView({ cmsData, theme }: ContactViewProps) {
  const isDark = theme.id === "dark";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});
    setIsSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
        // Automatically clear success message after 10 seconds
        setTimeout(() => setIsSuccess(false), 10000);
      } else {
        setFormErrors({ submit: data.error || "Failed to deliver message. Please try again." });
      }
    } catch (err: any) {
      setFormErrors({ submit: `Failed to connect to the recruitment system: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fadeIn space-y-16 animate-duration-500" id="contact-us-container">
      
      {/* Top Section: Split Layout for Contact Details and Form */}
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-stretch mt-6" id="contact-us-grid">
          
          {/* LEFT COLUMN: CONTACT DETAILS & SOCIALS */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full" id="contact-left-column">
            
            <div className="space-y-6">
              {/* Header Text Block */}
              <div className="space-y-3">
                <span className={`text-xs uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded border inline-block ${
                  isDark 
                    ? "text-cyan-400 bg-cyan-950/40 border-cyan-850/30" 
                    : "text-[#0073aa] bg-cyan-50 border-cyan-200"
                }`}>
                  Get In Touch
                </span>
                <h2 className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Contact Us
                </h2>
                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  We are here to answer your questions and assist you with your recruitment and global mobilization needs. Drop us a line or visit our office.
                </p>
              </div>

              {/* Contact Coordinates List */}
              <div className="space-y-4">
                
                {/* Phone */}
                <a 
                  href={`tel:${cmsData.contactInfo.phone}`}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                    isDark 
                      ? "bg-slate-900/30 border-slate-900/80 hover:bg-slate-900/50 hover:border-cyan-500/30" 
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100/70 hover:border-[#0073aa]/30 shadow-xs"
                  }`}
                >
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-[10px] uppercase font-mono tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      Call Our Office
                    </span>
                    <span className={`text-sm font-extrabold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                      {cmsData.contactInfo.phone}
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a 
                  href={`mailto:${cmsData.contactInfo.email}`}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                    isDark 
                      ? "bg-slate-900/30 border-slate-900/80 hover:bg-slate-900/50 hover:border-cyan-500/30" 
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100/70 hover:border-[#0073aa]/30 shadow-xs"
                  }`}
                >
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className={`text-[10px] uppercase font-mono tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      Email Coordinates
                    </span>
                    <span className={`text-sm font-extrabold block truncate ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                      {cmsData.contactInfo.email}
                    </span>
                  </div>
                </a>

                {/* Location */}
                <a 
                  href="https://maps.app.goo.gl/QDaaqr6mcDDeKW7W6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                    isDark 
                      ? "bg-slate-900/30 border-slate-900/80 hover:border-rose-500/50 hover:bg-slate-900/50" 
                      : "bg-slate-50 border-slate-200 shadow-xs hover:border-rose-500/50 hover:bg-white"
                  }`}
                >
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[10px] uppercase font-mono tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      Registered Address
                    </span>
                    <span className={`text-xs font-semibold leading-relaxed block ${isDark ? "text-slate-350" : "text-slate-705"}`}>
                      {cmsData.contactInfo.address}
                    </span>
                    <span className="text-[10px] text-rose-550 dark:text-rose-400 font-bold block mt-1 hover:underline">
                      View on Google Maps ↗
                    </span>
                  </div>
                </a>

              </div>
            </div>

            {/* Premium Social Links Section at the very bottom of left section */}
            <div className="space-y-3 pt-6 lg:pt-0">
              <span className={`text-[10px] uppercase tracking-widest font-mono block ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Connect Socially
              </span>
              <div className="flex items-center gap-3">
                
                {/* Facebook Button */}
                {cmsData.contactInfo.facebook && (
                  <a 
                    href={cmsData.contactInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Asia Link Services Facebook"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105 shadow-md shadow-blue-600/15"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                )}

                {/* WhatsApp Button */}
                {cmsData.contactInfo.whatsapp && (
                  <a 
                    href={cmsData.contactInfo.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Asia Link Services WhatsApp"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-105 shadow-md shadow-emerald-600/15"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.49-3.229l.372.221c1.547.92 3.509 1.407 5.514 1.408 5.613 0 10.177-4.543 10.18-10.138.002-2.71-1.048-5.257-2.956-7.171-1.91-1.914-4.453-2.969-7.165-2.97-5.618 0-10.183 4.545-10.187 10.14-.002 2.052.54 4.053 1.571 5.8l.243.414-.997 3.642 3.73-.978zM15.8 13.06c-.208-.104-1.23-.608-1.42-.678-.19-.07-.33-.104-.47.104-.14.208-.54.678-.66.815-.12.139-.24.156-.448.052-.208-.104-.88-.324-1.676-1.034-.62-.552-1.037-1.233-1.158-1.441-.12-.208-.013-.32.091-.424.095-.094.208-.243.312-.365.104-.12.139-.208.208-.347.069-.139.035-.26-.017-.365-.052-.104-.47-1.129-.644-1.546-.17-.408-.34-.352-.47-.359-.12-.007-.26-.007-.4-.007a.773.773 0 0 0-.554.26c-.19.208-.727.712-.727 1.735 0 1.023.746 2.012.85 2.151.104.139 1.467 2.24 3.553 3.14.496.214.883.342 1.185.438.498.158.951.135 1.309.082.399-.06 1.23-.503 1.403-.989.173-.486.173-.903.121-.991-.051-.087-.19-.139-.399-.243z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                )}

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <div className="lg:col-span-7 flex flex-col" id="contact-right-column">
            <div className={`rounded-3xl p-6 md:p-8 lg:p-10 border shadow-2xl relative flex-1 flex flex-col justify-between ${
              isDark 
                ? "bg-[#0b0f19] border-slate-900/80" 
                : "bg-white border-slate-200 shadow-sm"
            }`}>
              
              <div className="mb-5 space-y-1.5">
                <h3 className={`text-xl font-black font-sans tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Leave us a message
                </h3>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Complete the brief form below and our coordination division will respond shortly.
                </p>
              </div>

              {isSuccess && (
                <div className="mb-5 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex gap-3 text-xs text-emerald-400 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-extrabold text-[13px] text-emerald-350">Message Sent Successfully</p>
                    <p className="text-[11px] text-emerald-400/80 leading-relaxed">
                      Thank you for reaching out. We have successfully received your inquiry and our desk officers will follow up with you inside 24 hours.
                    </p>
                  </div>
                </div>
              )}

              {formErrors.submit && (
                <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex gap-3 text-xs text-red-400 animate-fadeIn" id="contact-submit-error">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-extrabold text-[13px] text-red-350">Submission Failed</p>
                    <p className="text-[11px] text-red-450 leading-relaxed">
                      {formErrors.submit}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className={`text-[10px] font-mono uppercase tracking-wider font-extrabold block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className={`w-full text-xs rounded-xl py-3.5 px-4 focus:ring-1 outline-none transition-all ${
                        isDark 
                          ? "bg-slate-950 text-slate-100 placeholder-slate-650 focus:ring-cyan-500 border-slate-900 focus:border-cyan-500" 
                          : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-cyan-500 focus:border-cyan-500"
                      } ${
                        formErrors.name ? "border-red-500/50 focus:border-red-500" : ""
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-[10px] text-red-500 font-mono italic mt-0.5">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Grid block for Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Email address */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className={`text-[10px] font-mono uppercase tracking-wider font-extrabold block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. name@company.com"
                        className={`w-full text-xs rounded-xl py-3.5 px-4 focus:ring-1 outline-none transition-all ${
                          isDark 
                            ? "bg-slate-950 text-slate-100 placeholder-slate-650 focus:ring-cyan-500 border-slate-900 focus:border-cyan-500" 
                            : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-cyan-500 focus:border-cyan-500"
                        } ${
                          formErrors.email ? "border-red-500/50 focus:border-red-500" : ""
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[10px] text-red-500 font-mono italic mt-0.5">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className={`text-[10px] font-mono uppercase tracking-wider font-extrabold block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +977-98513xxxxx"
                        className={`w-full text-xs rounded-xl py-3.5 px-4 focus:ring-1 outline-none transition-all ${
                          isDark 
                            ? "bg-slate-950 text-slate-100 placeholder-slate-650 focus:ring-cyan-500 border-slate-900 focus:border-cyan-500" 
                            : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-cyan-500 focus:border-cyan-500"
                        } ${
                          formErrors.phone ? "border-red-500/50 focus:border-red-500" : ""
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[10px] text-red-500 font-mono italic mt-0.5">{formErrors.phone}</p>
                      )}
                    </div>

                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className={`text-[10px] font-mono uppercase tracking-wider font-extrabold block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Inquiry subject heading"
                      className={`w-full text-xs rounded-xl py-3.5 px-4 focus:ring-1 outline-none transition-all ${
                        isDark 
                          ? "bg-slate-950 text-slate-100 placeholder-slate-655 focus:ring-cyan-500 border-slate-900 focus:border-cyan-500" 
                          : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-cyan-500 focus:border-cyan-500"
                      } ${
                        formErrors.subject ? "border-red-500/50 focus:border-red-500" : ""
                      }`}
                    />
                    {formErrors.subject && (
                      <p className="text-[10px] text-red-500 font-mono italic mt-0.5">{formErrors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className={`text-[10px] font-mono uppercase tracking-wider font-extrabold block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Detailed Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please write your detailed information or recruitment request here..."
                      className={`w-full text-xs rounded-xl py-3.5 px-4 focus:ring-1 outline-none transition-all resize-none ${
                        isDark 
                          ? "bg-slate-950 text-slate-100 placeholder-slate-655 focus:ring-cyan-500 border-slate-900 focus:border-cyan-500" 
                          : "bg-slate-50 border-slate-200 text-[#1e293b] placeholder-slate-400 focus:ring-cyan-500 focus:border-cyan-500"
                      } ${
                        formErrors.message ? "border-red-500/50 focus:border-red-500" : ""
                      }`}
                    />
                    {formErrors.message && (
                      <p className="text-[10px] text-red-500 font-mono italic mt-0.5">{formErrors.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit button at bottom */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-bold font-mono uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      isSubmitting
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-[#0073aa] hover:bg-[#006292] hover:scale-[1.005] active:scale-[0.995] text-white shadow-lg shadow-[#0073aa]/20"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section: Immersive, edge-to-edge Google Map spanning the complete screen width */}
      <div className={`w-full overflow-hidden relative border-t border-b ${
        isDark 
          ? "bg-[#0b0f19] border-slate-900" 
          : "bg-white border-slate-200"
      }`} id="map-subsection-fullscreen">
        <iframe 
          src={cmsData.contactInfo.googleMapEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.116634351631!2d85.3408442!3d27.7422132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb191848fc8ac3%3A0x7d5be3143fbc88f4!2sAsia%20Link%20Services%20Pvt.Ltd!5e0!3m2!1sen!2snp!4v1718742230000!5m2!1sen!2snp"} 
          width="100%" 
          style={{ border: 0 }}
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Asia Link Services Office Map Location"
          className={`w-full h-[480px] block ${isDark ? "opacity-90 invert-[8%] brightness-[95%] contrast-[105%]" : "opacity-100"}`}
        ></iframe>
        
        {/* Floating badge over the map for a premium touch */}
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl border shadow-2xl text-center text-xs font-semibold backdrop-blur-md transition-all ${
          isDark 
            ? "bg-slate-950/85 border-slate-800/80 text-slate-350" 
            : "bg-white/95 border-slate-200 text-slate-700"
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[10px]">Bansbari, Outside Ring Road, Kathmandu, Nepal (Near Royal Thai Embassy)</span>
          </div>
        </div>
      </div>

    </div>
  );
}
