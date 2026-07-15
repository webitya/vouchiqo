import Link from "next/link";
import {
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaBlogger,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-20 pb-10 border-t border-slate-800 mt-auto select-none text-left font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-12 mb-16">
          
          {/* Brand Info Block */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block bg-white p-2.5 rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/navbarlogovouchiqo.webp"
                alt="Vouchiqo Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Striving towards making the world a better place to shop with
              great savings! We help you turn verified promotional offers into
              instant value.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.instagram.com/vouchiqo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#E1306C] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/vouchiqo/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#0077B5] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 shadow-sm"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://medium.com/@lokesh.vouchiqo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#000000] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 shadow-sm"
                aria-label="Medium"
              >
                <FaMedium className="w-5 h-5" />
              </a>
              <a
                href="https://vouchiqo.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#F57D00] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 shadow-sm"
                aria-label="Blogger"
              >
                <FaBlogger className="w-5 h-5" />
              </a>
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
              Quick Links
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/categories">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/brands">
                  Partner Brands
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/nearby-offers">
                  Nearby Offers
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/expired-coupon-revival">
                  Coupon Revival
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/faq">
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Accounts & Portal */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
              Accounts
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/login">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/register">
                  Customer Register
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/merchant-login">
                  Merchant Login
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/merchant-register">
                  Merchant Register
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/admin-login">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
              Company
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/terms">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-transform" href="/contact">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center group">
                <a
                  className="hover:text-white transition-colors"
                  href="mailto:contact@vouchiqo.com"
                >
                  contact@vouchiqo.com
                </a>
              </li>
              <li className="flex items-center group">
                <span>+91-7997443334</span>
              </li>
              <li className="flex items-start group">
                <span className="leading-relaxed">
                  Ranchi, Jharkhand, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Block */}
        <div className="text-center pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Vouchiqo. All Rights Reserved.
          </p>
          <p className="text-sm text-slate-500 font-medium">
            Designed & Maintained by{" "}
            <a
              href="https://webitya.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 font-semibold transition-colors"
            >
              Webitya
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
