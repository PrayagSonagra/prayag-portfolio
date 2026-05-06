"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Mail, GitBranch, Link2, Send, CheckCircle, AlertCircle, Loader2, MapPin } from "lucide-react";

type FormState = "idle" | "sending" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required";
  else if (data.name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  if (!data.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email address";

  if (!data.subject.trim()) errors.subject = "Subject is required";
  else if (data.subject.trim().length < 3) errors.subject = "Subject must be at least 3 characters";

  if (!data.message.trim()) errors.message = "Message is required";
  else if (data.message.trim().length < 20) errors.message = "Message must be at least 20 characters";

  return errors;
}

function InputField({
  label,
  id,
  error,
  multiline = false,
  ...props
}: {
  label: string;
  id: string;
  error?: string;
  multiline?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  const baseClass = `w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-200 font-sans resize-none ${hasError
    ? "border-red-500/60 focus:border-red-500"
    : focused
      ? "border-[var(--accent-primary)] shadow-[0_0_0_3px_var(--accent-glow)]"
      : "border-[var(--border-default)] hover:border-[var(--border-strong)]"
    }`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-secondary">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={5}
          className={baseClass}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={baseClass}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-400 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const contactInfo = [
  { icon: Mail, label: "Email", value: "sonagraprayag2@gmail.com", href: "mailto:sonagraprayag2@gmail.com" },
  { icon: GitBranch, label: "GitHub", value: "github.com/prayagsonagra", href: "https://github.com/prayagsonagra" },
  { icon: Link2, label: "LinkedIn", value: "linkedin.com/in/prayagsonagra", href: "https://linkedin.com/in/prayagsonagra" },
  { icon: MapPin, label: "Location", value: "Ahmedabad, India", href: null },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Contact() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-80px" });
  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, margin: "-60px" });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setFormState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setFormState("success");
    } catch (err) {
      console.error("[contact form]", err);
      setFormState("error");
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setFormState("idle");
  };

  return (
    <section id="contact" className="py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(124,92,252,0.08),transparent)] pointer-events-none" />

      <div className="section-container">
        {/* Header */}
        <motion.div
          ref={titleRef}
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mb-4 inline-flex">
            <span className="text-accent-primary">05.</span>&nbsp;Contact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mt-4">
            Let's{" "}
            <span className="gradient-text">Build Something</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            Have a project in mind? Whether it's a real-time system, an AI product, or a complex UI — I'd love to hear about it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Contact info sidebar */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isFormInView ? "visible" : "hidden"}
            className="md:col-span-2 flex flex-col gap-5"
          >
            {contactInfo.map((item) => {
              const Icon = item.icon;
              const content = (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  className="glass-card rounded-lg p-4 flex items-start gap-4 glass-card-hover group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-accent-primary/10 border border-accent-primary/25 group-hover:bg-accent-primary/20 transition-colors">
                    <Icon className="w-4.5 h-4.5 text-accent-light" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-0.5 font-mono uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-text-primary break-all">{item.value}</p>
                  </div>
                </motion.div>
              );

              return item.href ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="block">
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}

            {/* Availability note */}
            <motion.div
              variants={itemVariants}
              className="glass-card rounded-lg p-4 border border-accent-emerald/30 bg-accent-emerald/5"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                <span className="text-xs font-mono font-semibold text-accent-emerald uppercase tracking-wider">
                  Available Now
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Open to full-time roles, freelance contracts, and interesting collaborations. Response within 24h.
              </p>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            ref={formRef}
            className="md:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={isFormInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            <div className="glass-card rounded-lg p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {formState === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-12 text-center gap-5"
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full bg-accent-emerald/15 border border-accent-emerald/40 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    >
                      <CheckCircle className="w-8 h-8 text-accent-emerald" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">Message Sent!</h3>
                      <p className="text-text-secondary text-sm max-w-sm">
                        Thanks for reaching out. I'll review your message and get back to you within 24 hours.
                      </p>
                    </div>
                    <button
                      id="contact-send-another"
                      onClick={handleReset}
                      className="text-sm font-medium text-accent-light hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    id="contact-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                    noValidate
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <InputField
                        label="Name"
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                      />
                      <InputField
                        label="Email"
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                      />
                    </div>
                    <InputField
                      label="Subject"
                      id="subject"
                      type="text"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleChange}
                      error={errors.subject}
                    />
                    <InputField
                      label="Message"
                      id="message"
                      placeholder="Tell me about your project, timeline, or just say hello..."
                      value={formData.message}
                      onChange={handleChange}
                      error={errors.message}
                      multiline
                    />

                    <motion.button
                      id="contact-submit"
                      type="submit"
                      disabled={formState === "sending"}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-accent-primary text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:bg-accent-secondary hover:shadow-[0_0_30px_var(--accent-glow)]"
                      whileHover={formState !== "sending" ? { scale: 1.01, y: -1 } : {}}
                      whileTap={formState !== "sending" ? { scale: 0.98 } : {}}
                    >
                      {formState === "sending" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </motion.button>

                    {/* Delivery channel badges */}
                    <div className="flex items-center justify-center gap-3 pt-1">
                      <span className="text-xs text-text-muted font-mono">delivered via</span>
                      {/* Gmail */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-elevated border border-border-subtle text-xs font-medium text-text-secondary">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" fill="#EA4335" fillOpacity=".15" stroke="#EA4335" strokeWidth="1.2"/>
                          <path d="M2 6l10 7 10-7" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Gmail
                      </span>
                      <span className="text-border-subtle">·</span>
                      {/* Slack */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-elevated border border-border-subtle text-xs font-medium text-text-secondary">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="2" width="8" height="8" rx="2" fill="#E01E5A" fillOpacity=".85"/>
                          <rect x="14" y="2" width="8" height="8" rx="2" fill="#36C5F0" fillOpacity=".85"/>
                          <rect x="2" y="14" width="8" height="8" rx="2" fill="#2EB67D" fillOpacity=".85"/>
                          <rect x="14" y="14" width="8" height="8" rx="2" fill="#ECB22E" fillOpacity=".85"/>
                        </svg>
                        Slack
                      </span>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
