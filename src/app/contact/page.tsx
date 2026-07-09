"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from "lucide-react";
import type { Variants } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
} satisfies Variants;

const fields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
];

export default function ContactSection() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Validation
  if (!form.name.trim()) {
    alert("Please enter your name.");
    return;
  }

  if (!form.email.trim()) {
    alert("Please enter your email.");
    return;
  }

  // Optional email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(form.email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (!form.message.trim()) {
    alert("Please enter your message.");
    return;
  }

  setLoading(true);

  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );

    alert("Message sent successfully!");

    setForm({
      name: "",
      email: "",
      message: "",
    });
  } catch (error) {
    console.error(error);
    alert("Failed to send message.");
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="relative w-full bg-[#1A1816] overflow-hidden py-24 px-6 md:px-16">
      {/* Background watermark */}
      <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-light text-white/[0.03] whitespace-nowrap select-none">
        LET&apos;S TALK
      </span>

      <div className="relative max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <p className="uppercase tracking-[0.35em] text-xs text-[#C9A25E] mb-4">
            Contact
          </p>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white">
            Get In Touch
          </h2>
          <p className="mt-4 text-white/50 max-w-md mx-auto leading-7 text-sm md:text-base">
            Have a question or a project in mind? We&apos;d love to hear from
            you — reach out and we&apos;ll respond shortly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            variants={fadeUp}
            className="lg:col-span-3 bg-white/[0.04] border border-white/10 rounded-[32px] p-8 md:p-10 backdrop-blur-sm flex flex-col gap-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              {fields.slice(0, 2).map((field, i) => (
                <motion.div
                  key={field.name}
                  custom={i + 2}
                  variants={fadeUp}
                  className="flex flex-col gap-2"
                >
                  <label className="text-xs uppercase tracking-[0.2em] text-white/40">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="bg-transparent border-b border-white/15 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A25E] transition-colors duration-300 resize-none"

                  />
                </motion.div>
              ))}
            </div>

            <motion.div custom={4} variants={fadeUp} className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-white/40">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="bg-transparent border-b border-white/15 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A25E] transition-colors duration-300 resize-none"

              />
            </motion.div>

            <motion.div custom={5} variants={fadeUp} className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-white/40">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us a little about your inquiry"
                className="bg-transparent border-b border-white/15 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A25E] transition-colors duration-300 resize-none"

              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="mt-3 self-start inline-flex items-center gap-2 bg-[#C9A25E] text-[#1A1816] px-8 py-3.5 rounded-full text-sm tracking-wide font-medium shadow-[0_8px_24px_rgba(201,162,94,0.25)] hover:shadow-[0_12px_32px_rgba(201,162,94,0.35)] transition-shadow duration-300"

            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </motion.form>

          {/* Floating glass card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={2}
            variants={fadeUp}
            className="lg:col-span-2 bg-white/[0.06] border border-white/10 rounded-[32px] p-8 md:p-10 backdrop-blur-md flex flex-col gap-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
          >
            <div className="flex flex-col gap-6">
              {[
                { icon: Mail, label: "Email", value: "hello@urbanbuy.com" },
                { icon: Phone, label: "Phone", value: "+1 (555) 012 3456" },
                { icon: MapPin, label: "Address", value: "128 Bronze Ave, New York" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#C9A25E]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      {label}
                    </p>
                    <p className="text-white/80 text-sm mt-1">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 flex gap-3">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#C9A25E] hover:border-[#C9A25E] transition-colors duration-300 group"
                >
                  <Icon className="w-4 h-4 text-white/70 group-hover:text-[#1A1816]" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
