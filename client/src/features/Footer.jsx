import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Building2, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-200 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row justify-between gap-10">

        {/* LEFT SECTION - CONTACT */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-slate-400 mb-2">Get in Touch</h2>

          <a href="mailto:contact@ruese.dev" className="flex items-center gap-1 text-slate-300 text-sm hover:underline">
            <Mail size={18} /> contact@ruese.dev
          </a>

          <a href="https://ruese.dev" className="flex items-center gap-1 text-slate-300 text-sm hover:underline">
            <Globe size={18} /> ruese.dev
          </a>

          <p className="flex items-center gap-1 text-slate-300 text-sm">
            <MapPin size={18} /> Lagos, Nigeria
          </p>
        </div>

        {/* RIGHT SECTION - LOGO + DESC + SOCIALS */}
        <div className="flex flex-col gap-2 md:max-w-sm items-end">
          <Link to="/" className="flex items-center">
            <span className="text-slate-400 font-bold text-lg">Winn</span>
            <span className="text-slate-200 font-bold text-lg">Estate</span>
            <Building2 color="#e2e8f0" className="w-5 h-5" strokeWidth={2.25} />
          </Link>

          <p className="text-slate-300 text-xs md:text-sm text-right">
            We provide trusted real estate listings, helping you find the perfect home, apartment or property with ease.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-1">
            <a href="#" className="hover:text-white border border-1 border-slate-200 rounded-full p-1.5">
              <Facebook size={18} />
            </a>
            <a href="#" className="hover:text-white border border-1 border-slate-200 rounded-full p-1.5">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-white border border-1 border-slate-200 rounded-full p-1.5">
              <Twitter size={18} />
            </a>
          </div>
        </div>

      </div>

      <div className="border-t border-slate-700 text-center py-4 text-sm text-slate-600">
        © {new Date().getFullYear()} WinnEstate. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
