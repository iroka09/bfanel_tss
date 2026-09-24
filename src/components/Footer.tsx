import React from "react";
import { Link } from "@tanstack/react-router";
import SocialMediaContacts from "@/components/SocialMediaContacts";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { submitEmail } from "@/server/actions/newsletter";

export default function Footer() {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, startTransition] = React.useTransition();

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Email field can't be empty.");
      return;
    }
    startTransition(async () => {
      const { success, result } = await submitEmail({ data: { email } });
      if (success) {
        toast.success(result);
        setEmail("");
      } else toast.error(result);
    });
  };

  return (
    <footer className="relative bg-[#0f1520] text-neutral-300 overflow-hidden">
      {/* Top glowing divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

      {/* Subtle radial glow behind content */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(249,115,22,0.07),transparent)] pointer-events-none" />

      <div className="relative container max-w-5xl mx-auto px-6 py-14">

        {/* Brand block */}
        <div className="text-center mb-10">
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-white tracking-wide">
            B-Fanel <span className="text-orange-400">Industries</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1 tracking-widest uppercase">
            Quality Pipes Built to Last
          </p>
        </div>

        {/* Nav links */}
        {/*
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs tracking-widest uppercase text-neutral-400 mb-10">
          {[
            { label: "About", href: "/about" },
            { label: "Products", href: "/#products" },
            { label: "Services", href: "/#services" },
            { label: "FAQs", href: "/#faqs" },
            { label: "Contact", href: "/#contact" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              className="hover:text-orange-400 transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>*/
        }
        {/* Divider */}
        <div className="h-px bg-white/5 mb-10" />

        {/* Newsletter */}
        <div className="max-w-md mx-auto text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-orange-400/80 mb-1">
            Newsletter
          </p>
          <h3 className="text-sm font-semibold text-white/90 mb-4">
            Stay updated on our latest products & offers
          </h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter your email address"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="
                bg-white/5 border-white/10 text-white placeholder:text-neutral-500
                focus-visible:ring-orange-500/40 focus-visible:border-orange-500/50
                rounded-lg h-10 text-sm transition
              "
            />
            <Button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="
                shrink-0 h-10 px-5 rounded-lg text-xs font-bold uppercase tracking-wider
                bg-orange-500 hover:bg-orange-400 text-black transition-all duration-200
                shadow-[0_0_14px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.45)]
                disabled:opacity-60
              "
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex justify-center mb-10">
          <SocialMediaContacts />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} B-Fanel Industries Limited.{" "}
            All Rights Reserved.
          </p>
          <Link
            to="https://wa.me/+2349014864168"
            className="hover:text-orange-400 transition-colors duration-200 underline underline-offset-2"
          >
            Built by Iroka Ntomchukwu
          </Link>
        </div>

      </div>
    </footer>
  );
}