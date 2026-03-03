"use client";

import { useState } from "react";

interface Props {
  phone: string;
  email: string;
  serviceArea: string;
}

export default function ContactContent({ phone, email, serviceArea }: Props) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (res.ok) {
        setStatus("success");
        setFormState({ name: "", email: "", phone: "", service: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-14 sm:py-20 bg-[#FAF5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 font-[var(--font-heading)]">
                Contact Details
              </h2>
              <ul className="space-y-5">
                {[
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    ),
                    label: "Phone",
                    value: phone,
                    href: `tel:${phone.replace(/\s/g, "")}`,
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    ),
                    label: "Email",
                    value: email,
                    href: `mailto:${email}`,
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    ),
                    label: "Service Area",
                    value: serviceArea,
                    href: null,
                  },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#8B5E3C]/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#8B5E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#8C8277] uppercase tracking-wider">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-[#2C2C2C] font-medium hover:text-[#8B5E3C] transition-colors break-all">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[#2C2C2C] font-medium">{item.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#2C2C2C] rounded-xl p-6 text-white">
              <h3 className="font-bold mb-2 font-[var(--font-heading)]">Response Time</h3>
              <p className="text-[#8C8277] text-sm">
                Jason typically responds within a few hours during business days. For urgent enquiries,
                call directly.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD0] p-5 sm:p-8">
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 font-[var(--font-heading)]">
                Send an Enquiry
              </h2>

              {status === "success" ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-[#3D5A3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#3D5A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#2C2C2C] mb-2 font-[var(--font-heading)]">Message Sent!</h3>
                  <p className="text-[#8C8277]">Thanks for reaching out. Jason will be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                        Your Name <span className="text-[#8B5E3C]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                        placeholder="Jason Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                        placeholder="04xx xxx xxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                      Email Address <span className="text-[#8B5E3C]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                      Interested In
                    </label>
                    <select
                      value={formState.service}
                      onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                      className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] bg-white"
                    >
                      <option value="">Select a service...</option>
                      <option value="deck">Decking</option>
                      <option value="shed">Sheds</option>
                      <option value="both">Both Deck & Shed</option>
                      <option value="other">Other / Not Sure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                      Tell Us About Your Project <span className="text-[#8B5E3C]">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] resize-none"
                      placeholder="Describe your project, size, location, timeline, any questions..."
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-500 text-sm">
                      Something went wrong. Please try again or call directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    {status === "loading" ? "Sending..." : "Send Enquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
