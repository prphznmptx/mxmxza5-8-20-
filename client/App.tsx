import { useEffect, useState } from "react";
import { BrowserRouter, Link, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ServicesFooter from "./components/layout/ServicesFooter";
import ServicesHomePage from "./pages/ServicesHomePage";
import HomePage from "./pages/HomePage";
import { supabase, useSupabaseAuth } from "./lib/supabase";
import { RewardsPointsProvider } from "./lib/rewardsPointsContext";
import { useHotelTenant } from "./lib/hotelTenant";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  cacheHomeIdentity,
  getCachedHomeIdentity,
  clearCachedHomeIdentity,
  HomeRole,
} from "./lib/homeIdentity";
import ServicesProfilePage from "./pages/ServicesProfilePage";
import BookingPage from "./pages/BookingPage";
import MenuPage from "./pages/MenuPage";
import FlutterwaveReturnPage from "./pages/FlutterwaveReturnPage";
import MenuManagementPage from "./pages/MenuManagementPage";
// ProfilePage disabled - see DISABLED_FEATURES.md
import StaffPortalPage from "./pages/StaffPortalPage";
import ManagementPage from "./pages/ManagementPage";
import TravelDeskPage from "./pages/TravelDeskPage";
import EventsPage from "./pages/EventsPage";
import SpecialEventOperationsPage from "./pages/SpecialEventOperationsPage";
import BlogPage from "./pages/BlogPage";
import ShopPage from "./pages/ShopPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import TasksPage from "./pages/TasksPage";
import ReportsPage from "./pages/ReportsPage";
import AccountsPage from "./pages/AccountsPage";
import BooksPage from "./pages/BooksPage";
import ReviewsPage from "./pages/ReviewsPage";
import ConciergePage from "./pages/ConciergePage";
import OffersPage from "./pages/OffersPage";
import HotelOffersPage from "./pages/HotelOffersPage";
import HotelOffersManagementPage from "./pages/HotelOffersManagementPage";
import HotelSpaPage from "./pages/HotelSpaPage";
import HotelSpaManagementPage from "./pages/HotelSpaManagementPage";
import WorkersPage from "./pages/WorkersPage";
import { isWorkerRole } from "./lib/roles";
import BillingPlansPage from "./pages/BillingPlansPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import PayoutMethodPage from "./pages/PayoutMethodPage";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";
import { Toaster } from "./components/ui/sonner";
import { Toaster as ToastRenderer } from "./components/ui/toaster";
import PlatformHotelsPage from "./pages/PlatformHotelsPage";
import "./global.css";

function RoleAwareHomePage() {
  const cachedIdentity = getCachedHomeIdentity();
  const [role, setRole] = useState<HomeRole>(cachedIdentity?.role ?? "guest");
  const [displayName, setDisplayName] = useState(cachedIdentity?.displayName ?? "Special Guest");
  const [isReady, setIsReady] = useState(Boolean(cachedIdentity));
  const { session, initialized: authInitialized } = useSupabaseAuth();

  useEffect(() => {
    let active = true;

    const setGuestIdentity = () => {
      if (!active) return;
      clearCachedHomeIdentity();
      setRole("guest");
      setDisplayName("Special Guest");
      setIsReady(true);
    };

    const loadHomeIdentity = async (user: { id: string } | null) => {
      if (!user) {
        setGuestIdentity();
        return;
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role, first_name, last_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;

      const profileRole = profile?.role as HomeRole | undefined;
      const nextRole: HomeRole = profileRole === "manager"
        ? "manager"
        : isWorkerRole(profileRole)
          ? "worker"
          : "guest";
      const fullName = [profile?.first_name, profile?.last_name]
        .filter((part): part is string => Boolean(part?.trim()))
        .join(" ");

      const nextDisplayName = fullName ||
        (nextRole === "manager"
          ? "Manager"
          : nextRole === "worker"
            ? "Worker"
            : "Special Guest");

      cacheHomeIdentity({ role: nextRole, displayName: nextDisplayName });
      setRole(nextRole);
      setDisplayName(nextDisplayName);
      setIsReady(true);
    };

    if (authInitialized) {
      void loadHomeIdentity(session?.user ?? null).catch(setGuestIdentity);
    }

    return () => {
      active = false;
    };
  }, [authInitialized, session?.user.id]);

  if (!isReady) {
    return <div className="min-h-screen" aria-busy="true" />;
  }

  if (role === "guest") {
    return <><HomePage displayName={displayName} /><Footer /></>;
  }

  return <><ServicesHomePage role={role === "manager" ? "manager" : "worker"} displayName={displayName} /><ServicesFooter /></>;
}

function CompactFooter({ audience }: { audience: "guest" | "staff" }) {
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
  const links = isGuest
    ? [{ label: "Share Your Experience", to: "/reviews" }]
    : [
        { label: "Account Settings", to: "/profile" },
        { label: "Help Center", to: "/profile" },
      ];

  return (
    <footer className="bg-sheraton-navy text-white">
      <div className="container space-y-4 py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 text-sm text-gray-200 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {contactDetails.map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-sheraton-gold" />
                {text}
              </span>
            ))}
          </div>
          <nav aria-label={isGuest ? "Guest links" : "Staff support links"} className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
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

function RouteAwareFooter() {
  const { pathname } = useLocation();
  const guestFooterPaths = [
    "/menu",
    "/travel",
    "/events",
    "/blog",
    "/shop",
    "/reviews",
    "/concierge",
    "/offers",
    "/spa",
    "/fitness",
  ];
  const serviceFooterPaths = [
    "/staff",
    "/management",
    "/platform/hotels",
    "/profile",
    "/tasks",
    "/reports",
    "/accounts",
    "/books",
    "/workers",
    "/billing",
    "/offers/manage",
    "/spa/manage",
  ];
  const matchesPath = (paths: string[]) => paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (pathname.startsWith("/events/operations/")) return <CompactFooter audience="staff" />;
  if (matchesPath(serviceFooterPaths)) return <CompactFooter audience="staff" />;
  if (matchesPath(guestFooterPaths)) return <CompactFooter audience="guest" />;
  return null;
}

function App() {
  return (
    <RewardsPointsProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<RoleAwareHomePage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/checkout/flutterwave-return" element={<FlutterwaveReturnPage />} />
              <Route path="/staff/menu" element={<MenuManagementPage />} />
              <Route path="/profile" element={<ServicesProfilePage />} />
              <Route path="/staff" element={<StaffPortalPage />} />
              <Route path="/management" element={<ManagementPage />} />
              <Route path="/platform/hotels" element={<PlatformHotelsPage />} />
              <Route path="/travel" element={<TravelDeskPage />} />
              <Route path="/events/operations/:eventId" element={<SpecialEventOperationsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/workers" element={<WorkersPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/tasks/*" element={<TasksPage />} />
              <Route path="/tasks/new" element={<TasksPage />} />
              <Route path="/tasks/list" element={<TasksPage />} />
              <Route path="/tasks/chat" element={<TasksPage />} />
              <Route path="/reports/*" element={<ReportsPage />} />
              <Route path="/reports/tasks" element={<ReportsPage />} />
              <Route path="/reports/performance" element={<ReportsPage />} />
              <Route path="/reports/vendors" element={<ReportsPage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/accounts/*" element={<AccountsPage />} />
              <Route path="/accounts/vendors" element={<AccountsPage />} />
              <Route path="/accounts/quotes" element={<AccountsPage />} />
              <Route path="/accounts/billing" element={<AccountsPage />} />
              <Route path="/billing/plans" element={<BillingPlansPage />} />
              <Route path="/billing/payment-methods" element={<PaymentMethodPage />} />
              <Route path="/billing/payout-methods" element={<PayoutMethodPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/concierge" element={<ConciergePage />} />
              <Route path="/offers" element={<HotelOffersPage />} />
              <Route path="/offers/manage" element={<HotelOffersManagementPage />} />
              <Route path="/offers-dev" element={<OffersPage />} />
              <Route path="/spa" element={<HotelSpaPage />} />
              <Route path="/spa/manage" element={<HotelSpaManagementPage />} />
              <Route
                path="/fitness"
                element={<PlaceholderPage section="Fitness Center" />}
              />
              <Route path="/concierge" element={<ConciergePage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <RouteAwareFooter />
          <Toaster />
            <ToastRenderer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </RewardsPointsProvider>
  );
}

export default App;
