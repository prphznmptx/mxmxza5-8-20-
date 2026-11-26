import { Link } from "react-router-dom";
import { useHotelTenant } from "../../lib/hotelTenant";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import QuickFeedback from "../feedback/QuickFeedback";
import {
  Crown,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Award,
  Shield,
  Heart,
} from "lucide-react";

export function CompactFooter({ audience }: { audience: "guest" | "staff" }) {
  const { tenant } = useHotelTenant();
  const isGuest = audience === "guest";
  const contactDetails = isGuest
    ? [
        { icon: Phone, text: "+1 (555) SPECIAL" },
        { icon: Mail, text: "special@sheraton.com" },
        { icon: MapPin, text: "Luxury District, Premium City" },
      ]
    : [
        { icon: Phone, text: "+1 (555) OPERATIONS" },
        { icon: Mail, text: "support@serviceplatform.com" },
        { icon: MapPin, text: "Operations Center, Management City" },
      ];
  const links = [
    { label: "Account Settings", to: "/profile" },
    { label: "Help Center", to: "/concierge" },
    { label: "Share Your Experience", to: "/reviews" },
  ];

  return (
    <footer className="bg-sheraton-navy text-white">
      <div className="container space-y-4 py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 text-sm text-gray-200">
            {contactDetails.map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-sheraton-gold" />
                {text}
              </span>
            ))}
          </div>
          <nav aria-label={isGuest ? "Guest links" : "Staff support links"} className="flex flex-col gap-2 text-sm">
            {links.map(({ label, to }) => (
              <Link key={label} to={to} className="text-gray-200 transition-colors hover:text-sheraton-gold">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-white/15 pt-3 text-xs text-gray-300 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {tenant?.name || (isGuest ? "IvyTowers" : "Service Platform")}. All rights reserved.</span>
          <nav aria-label="Legal links" className="flex gap-4">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sheraton-navy text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-sheraton-gold" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">Sheraton</span>
                <span className="text-xs text-sheraton-gold font-medium tracking-wide">
                  SPECIAL
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Where every moment becomes a special memory. Experience
              unparalleled luxury, personalized service, and exclusive
              privileges that make you truly special.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-sheraton-gold"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-sheraton-gold"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-sheraton-gold"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-sheraton-gold"
              >
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-sheraton-gold">
              Quick Access
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/book"
                className="text-sm text-gray-300 hover:text-sheraton-gold transition-colors"
              >
                Book Your Stay
              </Link>
              <Link
                to="/menu"
                className="text-sm text-gray-300 hover:text-sheraton-gold transition-colors"
              >
                Digital Menu
              </Link>
              <Link
                to="/spa"
                className="text-sm text-gray-300 hover:text-sheraton-gold transition-colors"
              >
                Spa & Wellness
              </Link>
              <Link
                to="/events"
                className="text-sm text-gray-300 hover:text-sheraton-gold transition-colors"
              >
                Events & Celebrations
              </Link>
              <Link
                to="/travel"
                className="text-sm text-gray-300 hover:text-sheraton-gold transition-colors"
              >
                Travel Experiences
              </Link>
            </nav>
          </div>

          {/* Special Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-sheraton-gold">
              Special Services
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/concierge"
                className="text-sm text-gray-300 hover:text-sheraton-gold transition-colors"
              >
                Personal Concierge
              </Link>
              <Link
                to="/profile"
                className="text-sm text-gray-300 hover:text-sheraton-gold transition-colors"
              >
                Loyalty Rewards
              </Link>
              <Link
                to="/shop"
                className="text-sm text-gray-300 hover:text-sheraton-gold transition-colors"
              >
                Exclusive Boutique
              </Link>
              <Link
                to="/blog"
                className="text-sm text-gray-300 hover:text-sheraton-gold transition-colors"
              >
                Special Community
              </Link>
              <Link
                to="/reviews"
                className="text-sm text-gray-300 hover:text-sheraton-gold transition-colors"
              >
                Share Your Experience
              </Link>
            </nav>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-sheraton-gold">
              Stay Connected
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-sheraton-gold" />
                <span>+1 (555) SPECIAL</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-sheraton-gold" />
                <span>special@sheraton.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-sheraton-gold" />
                <span>Luxury District, Premium City</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-sheraton-gold">
                Special Offers & Updates
              </p>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button className="sheraton-gradient">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-sheraton-gold" />
                <span>5-Star Luxury</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-sheraton-gold" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-sheraton-gold" />
                <span>Guest-Centered</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <Link
                to="/privacy"
                className="hover:text-sheraton-gold transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-sheraton-gold transition-colors"
              >
                Terms of Service
              </Link>
              <span>
                © {currentYear} Sheraton Special. All rights reserved.
              </span>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            <p>
              Making every guest feel special through technology, hospitality,
              and personalized experiences.
              <br />
              Your journey to extraordinary begins here.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Feedback Button */}
      <QuickFeedback section="Overall Experience" position="bottom-right" />
    </footer>
  );
};

export default Footer;
