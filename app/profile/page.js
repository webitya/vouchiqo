"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { 
  Award, 
  Bell, 
  Bookmark, 
  Calendar, 
  Check, 
  CheckCircle2, 
  Copy, 
  Download, 
  Filter, 
  Heart, 
  History, 
  Lock, 
  MapPin, 
  PiggyBank, 
  Save, 
  Search, 
  Share2, 
  Sparkles, 
  Trash2, 
  TrendingUp, 
  User, 
  Wallet,
  AlertTriangle,
  Map
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import KPICard from "@/components/KPICard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import toast from "react-hot-toast";

const DONUT_COLORS = ["#FF7A18", "#1E4FAF", "#00B67A", "#FFB020", "#A855F7", "#3B82F6", "#EC4899", "#14B8A6"];

const INTEREST_CATEGORIES = [
  "Fashion & Apparel", "Electronics & Gadgets", "Food & Dining", "Travel & Hotels",
  "Beauty & Skincare", "Home & Décor", "Home Improvement", "Health & Fitness",
  "Education & Courses", "Finance & Insurance", "Gaming", "Automotive",
  "Kids & Baby", "Pets", "Organic & Wellness", "Grocery & Supermarket"
];

// Simple client-side CSS Confetti particles generator
function ConfettiOverlay({ active }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
      {Array.from({ length: 80 }).map((_, i) => {
        const left = Math.random() * 100;
        const size = Math.random() * 8 + 6;
        const delay = Math.random() * 3;
        const duration = Math.random() * 2 + 2;
        const rotation = Math.random() * 360;
        const color = DONUT_COLORS[Math.floor(Math.random() * DONUT_COLORS.length)];
        
        return (
          <div
            key={i}
            className="absolute top-[-20px] rounded-sm opacity-90 animate-fall"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              transform: `rotate(${rotation}deg)`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function ProfileHub() {
  const [activeTab, setActiveTab] = useState("savings");
  const [loading, setLoading] = useState(true);
  const [savingsData, setSavingsData] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "", email: "", phone: "", city: "", state: "", interests: [],
    emailNotifications: true, smsNotifications: false, expiryAlerts: true
  });
  const [savedClaims, setSavedClaims] = useState([]);
  const [savingSettings, setSavingSettings] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Chart range & toggles
  const [timelineRange, setTimelineRange] = useState("12");
  const [hoveredChartIdx, setHoveredChartIdx] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const chartSvgRef = useRef(null);

  // Table search/pagination/sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected Category filter (from Donut slice click)
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Confetti triggering state
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [copiedShareCard, setCopiedShareCard] = useState(false);

  // Load Tab from URL Parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      const validTabs = ["savings", "saved", "wallet", "activity", "nearby", "settings"];
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Sync activeTab to URL search params
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (typeof window !== "undefined") {
      const url = new URL(window.location);
      url.searchParams.set("tab", tabName);
      window.history.pushState({}, "", url);
    }
  };

  // Main data load
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch Savings / redemptions
      const savingsRes = await fetch("/api/users/savings");
      if (savingsRes.ok) {
        const payload = await savingsRes.json();
        if (payload.success) {
          setSavingsData(payload.data);
          checkAndTriggerConfetti(payload.data.milestones);
        }
      }

      // Fetch User settings profile
      const userRes = await fetch("/api/users");
      if (userRes.ok) {
        const payload = await userRes.json();
        if (payload.success) {
          const { user, profile } = payload.data;
          setProfileData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || user.phoneNumber || "",
            city: profile?.location?.city || "",
            state: profile?.location?.state || "",
            interests: profile?.interests || [],
            emailNotifications: profile?.emailNotifications ?? true,
            smsNotifications: profile?.smsNotifications ?? false,
            expiryAlerts: profile?.expiryAlerts ?? true,
          });
        }
      }

      // Fetch active saved claims
      const claimsRes = await fetch("/api/claims?status=active");
      if (claimsRes.ok) {
        const payload = await claimsRes.json();
        if (payload.success) {
          const mapped = (payload.data.claims || []).map((claim) => ({
            ...claim.couponId,
            claimId: claim._id,
          }));
          setSavedClaims(mapped);
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to sync profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const checkAndTriggerConfetti = (milestones) => {
    try {
      const celebrated = JSON.parse(localStorage.getItem("vouchiqo_celebrated_milestones") || "[]");
      const newlyUnlocked = [];
      milestones.forEach((m) => {
        if (m.achieved && !celebrated.includes(m.id)) {
          newlyUnlocked.push(m.id);
        }
      });
      if (newlyUnlocked.length > 0) {
        setTriggerConfetti(true);
        localStorage.setItem("vouchiqo_celebrated_milestones", JSON.stringify([...celebrated, ...newlyUnlocked]));
        setTimeout(() => setTriggerConfetti(false), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          location: { city: profileData.city, state: profileData.state, country: "IN" },
          interests: profileData.interests,
          emailNotifications: profileData.emailNotifications,
          smsNotifications: profileData.smsNotifications,
          expiryAlerts: profileData.expiryAlerts
        })
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.success) {
          toast.success("Profile saved!");
          loadData(); // reload
        } else {
          toast.error(payload.message || "Failed to update profile.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving profile settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  // Remove saved coupon claim
  const handleRemoveClaim = async (e, claimId) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmRemove = window.confirm("Remove this coupon from bookmarks?");
    if (!confirmRemove) return;
    try {
      const res = await fetch(`/api/claims/${claimId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Bookmark removed.");
        setSavedClaims(savedClaims.filter((c) => c.claimId !== claimId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Claim/Redeem from Saved Tab
  const [selectedSavedCoupon, setSelectedSavedCoupon] = useState(null);
  const handleRedeemConfirm = async (couponId) => {
    const couponObj = savedClaims.find((c) => c._id === couponId);
    if (!couponObj || !couponObj.claimId) throw new Error("Claim ID not found");

    const res = await fetch("/api/redemptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimId: couponObj.claimId, couponId: couponId })
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload.success) {
        toast.success("Voucher claimed!");
        loadData();
        return payload.data.couponCode;
      }
    }
    throw new Error("Failed to redeem coupon.");
  };

  const handleShareSavings = () => {
    const saved = savingsData?.kpis?.totalSavedMonth || 0;
    const shareText = `I saved ₹${saved.toLocaleString("en-IN")} this month using Vouchiqo! 🔴 Find verified coupon codes and save. https://vouchiqo.com`;
    navigator.clipboard.writeText(shareText);
    setCopiedShareCard(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedShareCard(false), 3000);
  };

  // CSV Exporter
  const handleExportCSV = () => {
    if (!savingsData || !savingsData.recentTransactions) return;
    const headers = ["Date", "Brand", "Coupon Code", "Original Price", "Discount Applied", "Amount Paid", "Amount Saved", "Category"];
    const rows = savingsData.recentTransactions.map((t) => [
      t.date, t.brand, t.code, t.originalPrice, t.discountApplied, t.amountPaid, t.amountSaved, t.category
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Vouchiqo_Savings_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !savingsData) {
    return (
      <DashboardLayout title="Customer Profile" user={{ name: "User", role: "customer" }}>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Syncing profile data...</p>
        </div>
      </DashboardLayout>
    );
  }

  // 1. Transaction history computations
  let filteredTx = savingsData?.recentTransactions || [];
  if (selectedCategory) {
    filteredTx = filteredTx.filter((t) => t.category.toLowerCase() === selectedCategory.toLowerCase());
  }
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filteredTx = filteredTx.filter((t) => 
      t.brand.toLowerCase().includes(term) || t.code.toLowerCase().includes(term) || t.category.toLowerCase().includes(term)
    );
  }

  // Sort
  filteredTx.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === "saved") {
      valA = parseFloat(a.amountSaved.replace(/[^0-9.]/g, ""));
      valB = parseFloat(b.amountSaved.replace(/[^0-9.]/g, ""));
    } else if (sortField === "date") {
      valA = new Date(a.date.split(" ").reverse().join(" "));
      valB = new Date(b.date.split(" ").reverse().join(" "));
    }
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalFilteredCount = filteredTx.length;
  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTx = filteredTx.slice(startIndex, startIndex + itemsPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  // 2. Timeline calculations
  let activeTimeline = [...(savingsData?.timeline || [])];
  if (timelineRange === "3") activeTimeline = activeTimeline.slice(-3);
  else if (timelineRange === "6") activeTimeline = activeTimeline.slice(-6);
  else if (timelineRange === "12") activeTimeline = activeTimeline.slice(-12);

  const maxSaved = Math.max(...activeTimeline.map((t) => t.saved), 10);
  const maxSpent = Math.max(...activeTimeline.map((t) => t.spent), 10);
  const svgWidth = 500;
  const svgHeight = 220;
  const paddingX = 55;
  const paddingY = 30;
  const graphWidth = svgWidth - paddingX - 25;
  const graphHeight = svgHeight - paddingY - 15;
  const nPoints = activeTimeline.length;

  const pointsSaved = activeTimeline.map((t, idx) => {
    const x = paddingX + (nPoints > 1 ? (idx / (nPoints - 1)) * graphWidth : graphWidth / 2);
    const y = svgHeight - paddingY - (t.saved / maxSaved) * graphHeight;
    return { x, y, saved: t.saved, spent: t.spent, label: t.label, count: t.count };
  });

  const pointsSpent = activeTimeline.map((t, idx) => {
    const x = paddingX + (nPoints > 1 ? (idx / (nPoints - 1)) * graphWidth : graphWidth / 2);
    const y = svgHeight - paddingY - (t.spent / maxSpent) * graphHeight;
    return { x, y };
  });

  const lineSavedPath = pointsSaved.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaSavedPath = pointsSaved.length > 0 
    ? `${lineSavedPath} L ${pointsSaved[pointsSaved.length - 1].x} ${svgHeight - paddingY} L ${pointsSaved[0].x} ${svgHeight - paddingY} Z`
    : "";

  const lineSpentPath = pointsSpent.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaSpentPath = pointsSpent.length > 0
    ? `${lineSpentPath} L ${pointsSpent[pointsSpent.length - 1].x} ${svgHeight - paddingY} L ${pointsSpent[0].x} ${svgHeight - paddingY} Z`
    : "";

  const handleSvgMouseMove = (e) => {
    if (!chartSvgRef.current || pointsSaved.length === 0) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relativeX = (mouseX / rect.width) * svgWidth;
    
    let closestIdx = 0;
    let minDiff = Infinity;
    pointsSaved.forEach((p, idx) => {
      const diff = Math.abs(p.x - relativeX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setHoveredChartIdx(closestIdx);
    setTooltipPos({
      x: (pointsSaved[closestIdx].x / svgWidth) * rect.width,
      y: (pointsSaved[closestIdx].y / svgHeight) * rect.height - 70
    });
  };

  // Donut slices
  let totalSavedVal = savingsData?.categoryBreakdown?.reduce((sum, item) => sum + item.saved, 0) || 0;
  let donutCircumference = 2 * Math.PI * 60;
  let cumulativePct = 0;

  const donutSlices = (savingsData?.categoryBreakdown || []).map((item, idx) => {
    const percentage = item.saved / (totalSavedVal || 1);
    const strokeDash = percentage * donutCircumference;
    const strokeOffset = donutCircumference - strokeDash + (cumulativePct * donutCircumference);
    cumulativePct -= percentage;
    return {
      category: item.category,
      saved: item.saved,
      pct: item.pct,
      color: DONUT_COLORS[idx % DONUT_COLORS.length],
      dashArray: `${strokeDash} ${donutCircumference}`,
      dashOffset: strokeOffset
    };
  });

  return (
    <DashboardLayout
      title="Customer Profile"
      user={{ name: profileData.name || "Sarah Jenkins", role: "customer" }}
    >
      <ConfettiOverlay active={triggerConfetti} />

      {/* Tabs Header Navigation */}
      <div className="flex border-b border-brand-border bg-brand-surface p-1 rounded-lg gap-1 max-w-fit overflow-x-auto">
        {[
          { id: "savings", label: "My Savings", icon: PiggyBank },
          { id: "saved", label: "Saved Deals", icon: Bookmark },
          { id: "wallet", label: "Cashback Wallet", icon: Wallet },
          { id: "activity", label: "My Activity", icon: History },
          { id: "nearby", label: "Nearby Offers", icon: MapPin },
          { id: "settings", label: "Settings", icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-brand-subtext hover:text-brand-navy hover:bg-brand-border/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANEL */}
      <div className="space-y-6 pt-2">

        {/* 1. MY SAVINGS VIEW */}
        {activeTab === "savings" && savingsData && (
          <div className="space-y-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Saved This Month"
                value={`₹${savingsData.kpis.totalSavedMonth.toLocaleString("en-IN")}`}
                change={14.8}
                icon={PiggyBank}
              />
              <KPICard
                title="Total Lifetime Saved"
                value={`₹${savingsData.kpis.totalSavedAllTime.toLocaleString("en-IN")}`}
                change={8.2}
                icon={Award}
              />
              <KPICard
                title="Total Spent Tracked"
                value={`₹${savingsData.kpis.totalSpentAllTime.toLocaleString("en-IN")}`}
                change={4.5}
                icon={TrendingUp}
              />
              <div className="bg-brand-bg border border-brand-border rounded-[16px] p-5 shadow-sm space-y-3 relative overflow-hidden">
                <span className="text-[10px] text-brand-subtext font-bold uppercase tracking-wider">Savings Rate</span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black font-heading ${
                    savingsData.kpis.savingsRate > 20 
                      ? "text-brand-success" 
                      : savingsData.kpis.savingsRate >= 10 
                        ? "text-brand-warning" 
                        : "text-brand-subtext"
                  }`}>
                    {savingsData.kpis.savingsRate}%
                  </span>
                </div>
                <p className="text-[10px] text-brand-subtext font-semibold">
                  You save ₹{savingsData.kpis.savingsRate} for every ₹100 spent.
                </p>
              </div>
            </div>

            {/* Achievements row */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-heading text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-warning fill-brand-warning/10" />
                <span>Savings Milestone Badges</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {savingsData.milestones.map((m) => {
                  const dateStr = m.achievedAt 
                    ? new Date(m.achievedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                    : "";
                  return (
                    <div 
                      key={m.id} 
                      className={`relative group rounded-xl p-4 border text-center transition-all ${
                        m.achieved 
                          ? "bg-brand-surface border-brand-success/20 text-brand-success" 
                          : "bg-brand-surface/40 border-brand-border/60 text-brand-subtext"
                      }`}
                    >
                      <div className="mx-auto w-9 h-9 rounded-full flex items-center justify-center border bg-white mb-2 shadow-sm">
                        {m.achieved 
                          ? <Award className="w-5 h-5 text-brand-success" />
                          : <Lock className="w-4 h-4 text-slate-300" />
                        }
                      </div>
                      <span className="text-[10px] font-bold block truncate uppercase tracking-wider">
                        {m.title}
                      </span>
                      {m.achieved ? (
                        <span className="text-[9px] text-brand-subtext block mt-1 font-semibold">
                          Unlocked {dateStr}
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 block mt-1 font-semibold">
                          Target ₹{m.threshold}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline chart & share card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 bg-brand-bg border border-brand-border rounded-[16px] p-5 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-brand-border pb-3">
                  <div>
                    <h3 className="font-heading text-xs font-bold text-brand-navy tracking-wider uppercase">
                      Savings vs. Spending Timeline
                    </h3>
                  </div>
                  <div className="flex items-center border border-brand-border rounded-lg p-0.5 bg-brand-surface shrink-0">
                    {["3", "6", "12", "all"].map((r) => (
                      <button
                        key={r}
                        onClick={() => { setTimelineRange(r); setHoveredChartIdx(null); }}
                        className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all uppercase ${
                          timelineRange === r 
                            ? "bg-brand-navy text-white shadow-sm" 
                            : "text-brand-subtext hover:text-brand-navy"
                        }`}
                      >
                        {r === "all" ? "All Time" : `${r}M`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative flex-1 min-h-[200px]">
                  <svg
                    ref={chartSvgRef}
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-full cursor-crosshair"
                    onMouseMove={handleSvgMouseMove}
                    onMouseLeave={() => setHoveredChartIdx(null)}
                  >
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="savings-grad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF7A18" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#FF7A18" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="spent-grad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1E4FAF" stopOpacity="0.10" />
                        <stop offset="100%" stopColor="#1E4FAF" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gridlines */}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <line
                        key={i}
                        x1={paddingX}
                        y1={paddingY + (i / 4) * graphHeight}
                        x2={svgWidth - 25}
                        y2={paddingY + (i / 4) * graphHeight}
                        stroke="#e2e8f0"
                        strokeWidth="0.5"
                        strokeDasharray="4 4"
                      />
                    ))}

                    {pointsSpent.length > 1 && (
                      <>
                        <path d={areaSpentPath} fill="url(#spent-grad2)" />
                        <path d={lineSpentPath} fill="none" stroke="#1E4FAF" strokeWidth="2" />
                      </>
                    )}
                    {pointsSaved.length > 1 && (
                      <>
                        <path d={areaSavedPath} fill="url(#savings-grad2)" />
                        <path d={lineSavedPath} fill="none" stroke="#FF7A18" strokeWidth="2.5" />
                      </>
                    )}

                    {/* Nodes */}
                    {pointsSaved.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="3" fill="#ffffff" stroke="#FF7A18" strokeWidth="1.5" />
                    ))}

                    {/* Left Y Axis */}
                    <text x={10} y={paddingY + 3} className="text-[9px] font-bold fill-brand-subtext">₹{Math.round(maxSaved)}</text>
                    <text x={10} y={svgHeight - paddingY + 3} className="text-[9px] font-bold fill-brand-subtext">₹0</text>

                    {/* Right Y Axis */}
                    <text x={svgWidth - 20} y={paddingY + 3} className="text-[9px] font-bold fill-brand-subtext text-right">₹{Math.round(maxSpent)}</text>
                    <text x={svgWidth - 20} y={svgHeight - paddingY + 3} className="text-[9px] font-bold fill-brand-subtext text-right">₹0</text>

                    {/* X Axis */}
                    {activeTimeline.map((t, i) => {
                      const x = paddingX + (nPoints > 1 ? (i / (nPoints - 1)) * graphWidth : graphWidth / 2);
                      if (nPoints > 7 && i % 2 !== 0) return null;
                      return (
                        <text key={i} x={x} y={svgHeight - paddingY + 14} textAnchor="middle" className="text-[9px] font-bold fill-brand-subtext">
                          {t.label.split(" ")[0]}
                        </text>
                      );
                    })}
                  </svg>

                  {/* Tooltip */}
                  {hoveredChartIdx !== null && pointsSaved[hoveredChartIdx] && (
                    <div
                      className="absolute z-20 bg-brand-navy text-white text-[10px] font-semibold p-2.5 rounded-lg shadow-xl w-44 pointer-events-none text-left"
                      style={{
                        left: `${tooltipPos.x}px`,
                        top: `${tooltipPos.y}px`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="font-black border-b border-white/10 pb-1 mb-1 text-[10px] text-brand-warning uppercase">
                        {pointsSaved[hoveredChartIdx].label}
                      </div>
                      <div className="flex justify-between">
                        <span>Saved:</span>
                        <span className="font-bold text-orange-400">₹{pointsSaved[hoveredChartIdx].saved.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Spent:</span>
                        <span className="font-bold text-blue-300">₹{pointsSaved[hoveredChartIdx].spent.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-6 text-[9px] font-bold text-brand-subtext pt-2 border-t border-brand-border/40">
                  <div className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded-full bg-orange-500"></span><span>Savings</span></div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded-full bg-blue-600"></span><span>Spending</span></div>
                </div>
              </div>

              {/* Share card Widget */}
              <div className="lg:col-span-4 bg-brand-navy border border-white/10 text-white rounded-[16px] p-5 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-brand-warning font-bold uppercase tracking-wider font-heading">Highlight Card</span>
                  <h3 className="font-heading text-sm font-bold">Personalized Savings Card</h3>
                  <p className="text-[10px] text-slate-300 leading-normal">
                    Generate an image card displaying your tracked savings on Vouchiqo to share on WhatsApp or Twitter!
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center space-y-3">
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Monthly savings certificate</span>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-300 block font-semibold">I SAVED THIS MONTH</span>
                    <span className="text-2xl font-black text-brand-gradient tracking-tight block">
                      ₹{savingsData.kpis.totalSavedMonth.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[8px] text-slate-400 block font-medium">with verified discount vouchers</span>
                  </div>
                </div>

                <Button
                  onClick={handleShareSavings}
                  className="btn-primary w-full py-2.5 text-xs font-bold border-0 h-auto cursor-pointer flex justify-center items-center gap-1 text-white"
                >
                  {copiedShareCard ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedShareCard ? "Copied Share Text!" : "Copy Savings Link"}</span>
                </Button>
              </div>

            </div>

            {/* Category breakdown slice & top brands */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-brand-bg border border-brand-border rounded-[16px] p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-heading text-xs font-bold text-brand-navy tracking-wider uppercase">Category Breakdown</h3>
                  </div>
                  {selectedCategory && (
                    <button onClick={() => setSelectedCategory(null)} className="text-[9px] font-bold text-brand-error uppercase hover:underline">Clear</button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                  <div className="relative w-32 h-32 shrink-0">
                    <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                      {donutSlices.map((slice, i) => (
                        <circle
                          key={slice.category}
                          cx="80" cx-y="80" cy="80" r="60" fill="transparent"
                          stroke={slice.color} strokeWidth="15" strokeDasharray={slice.dashArray} strokeDashoffset={slice.dashOffset}
                          className="cursor-pointer transition-all duration-300 hover:stroke-[18]"
                          onClick={() => setSelectedCategory(slice.category)}
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                      <span className="text-[8px] text-brand-subtext font-bold uppercase">Total</span>
                      <span className="text-xs font-black text-brand-navy">₹{savingsData.kpis.totalSavedAllTime.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>

                  <div className="space-y-1 flex-grow max-w-[180px]">
                    {donutSlices.map((slice) => (
                      <button
                        key={slice.category}
                        onClick={() => setSelectedCategory(slice.category === selectedCategory ? null : slice.category)}
                        className={`w-full flex items-center justify-between text-[9px] font-bold p-1 rounded transition-all ${
                          selectedCategory === slice.category ? "bg-brand-surface text-brand-navy" : "text-brand-text hover:bg-brand-surface"
                        }`}
                      >
                        <div className="flex items-center gap-1 truncate">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }}></span>
                          <span className="truncate">{slice.category}</span>
                        </div>
                        <span>{slice.pct}%</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-brand-bg border border-brand-border rounded-[16px] p-5 shadow-sm space-y-4">
                <h3 className="font-heading text-xs font-bold text-brand-navy tracking-wider uppercase">Top Partner Brands</h3>
                <div className="space-y-3">
                  {savingsData.brandBreakdown.map((brand) => {
                    const savedVal = parseFloat(brand.saved.replace(/[^0-9.]/g, ""));
                    const maxSavedVal = parseFloat(savingsData.brandBreakdown[0].saved.replace(/[^0-9.]/g, "")) || 1;
                    return (
                      <div key={brand.brand} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span>{brand.brand} ({brand.claims} claims)</span>
                          <span className="text-brand-success">{brand.saved}</span>
                        </div>
                        <div className="w-full bg-brand-surface h-1.5 rounded-full overflow-hidden border border-brand-border">
                          <div className="bg-brand-blue h-full rounded-full" style={{ width: `${(savedVal / maxSavedVal) * 100}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Transactions table history */}
            <div className="bg-brand-bg border border-brand-border rounded-[16px] p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-b border-brand-border pb-3">
                <div>
                  <h3 className="font-heading text-xs font-bold text-brand-navy tracking-wider uppercase">Transaction Log</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-brand-subtext absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      placeholder="Search history..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="pl-8 h-8 text-[10px] w-36 bg-brand-surface border-brand-border"
                    />
                  </div>
                  <Button onClick={handleExportCSV} variant="outline" className="btn-tertiary h-8 text-[10px] font-bold border-brand-border flex items-center gap-1 shadow-none px-3 cursor-pointer"><Download className="w-3.5 h-3.5" /><span>CSV</span></Button>
                </div>
              </div>

              {paginatedTx.length > 0 ? (
                <div className="space-y-3">
                  <div className="border border-brand-border rounded-xl overflow-hidden">
                    <Table className="w-full text-xs">
                      <TableHeader className="bg-brand-surface border-b border-brand-border">
                        <TableRow>
                          <TableHead onClick={() => toggleSort("date")} className="p-3 cursor-pointer text-brand-subtext font-bold">Date {sortField === "date" && (sortOrder === "asc" ? "▲" : "▼")}</TableHead>
                          <TableHead onClick={() => toggleSort("brand")} className="p-3 cursor-pointer text-brand-subtext font-bold">Brand {sortField === "brand" && (sortOrder === "asc" ? "▲" : "▼")}</TableHead>
                          <TableHead className="p-3 text-brand-subtext font-bold">Code</TableHead>
                          <TableHead className="p-3 text-brand-subtext font-bold text-right">Saved</TableHead>
                          <TableHead className="p-3 text-brand-subtext font-bold">Category</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="font-semibold text-brand-text">
                        {paginatedTx.map((tx) => (
                          <TableRow key={tx._id} className="hover:bg-brand-surface border-b border-brand-border last:border-0">
                            <TableCell className="p-3 text-brand-subtext">{tx.date}</TableCell>
                            <TableCell className="p-3 font-bold text-brand-navy">{tx.brand}</TableCell>
                            <TableCell className="p-3 font-mono text-[10px] text-brand-blue">{tx.code}</TableCell>
                            <TableCell className="p-3 text-right text-brand-success font-bold text-sm">{tx.amountSaved}</TableCell>
                            <TableCell className="p-3"><Badge className="bg-brand-surface text-brand-navy border border-brand-border text-[9px] px-2 py-0.5">{tx.category}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between text-[10px] text-brand-subtext">
                      <span>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalFilteredCount)} of {totalFilteredCount}</span>
                      <div className="flex gap-1">
                        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="h-7 text-[9px] px-2">Prev</Button>
                        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-7 text-[9px] px-2">Next</Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-brand-subtext font-bold bg-brand-surface/40 rounded-xl">No transactions found.</div>
              )}
            </div>

          </div>
        )}

        {/* 2. SAVED DEALS TAB */}
        {activeTab === "saved" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <h3 className="font-heading text-xs font-bold text-brand-navy uppercase tracking-wider">Bookmarked & Saved Deals</h3>
            </div>
            {savedClaims.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedClaims.map((coupon) => (
                  <div key={coupon._id} className="relative group">
                    <CouponCard coupon={coupon} onRedeem={(c) => setSelectedSavedCoupon(c)} />
                    <button
                      type="button"
                      onClick={(e) => handleRemoveClaim(e, coupon.claimId)}
                      className="absolute top-3 right-12 z-20 w-8 h-8 rounded-full bg-white border border-brand-border text-brand-subtext hover:text-brand-error flex items-center justify-center shadow transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Bookmark} title="No saved coupons" description="Save coupons while browsing to keep track of deals you want to use later." />
            )}
          </div>
        )}

        {/* 3. CASHBACK WALLET TAB */}
        {activeTab === "wallet" && (
          <div className="space-y-6">
            
            {/* Balance cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-1 relative">
                <span className="text-[10px] text-brand-subtext font-bold uppercase tracking-wider">Available Balance</span>
                <span className="text-2xl font-black font-heading text-brand-navy block">₹240.00</span>
                <span className="text-[9px] text-brand-success font-semibold flex items-center gap-1"><Check className="w-3 h-3" /> Ready to withdraw</span>
              </div>
              
              <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-1 relative">
                <span className="text-[10px] text-brand-subtext font-bold uppercase tracking-wider">Pending Balance</span>
                <span className="text-2xl font-black font-heading text-slate-500 block">₹64.00</span>
                <span className="text-[9px] text-slate-400 font-semibold">Awaiting merchant verification (up to 7 days)</span>
              </div>

              <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm flex flex-col justify-center items-stretch gap-2.5">
                <Button disabled className="w-full py-2 text-xs font-bold border-0 h-auto cursor-not-allowed opacity-50 bg-brand-navy text-white">
                  Request Wallet Payout
                </Button>
                <span className="text-[9px] text-brand-subtext text-center font-bold flex items-center justify-center gap-1">
                  <Info className="w-3.5 h-3.5 text-brand-blue" />
                  Redemption requests are Coming Soon
                </span>
              </div>
            </div>

            {/* Wallet history table */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-heading text-xs font-bold text-brand-navy uppercase tracking-wider">Cashback Transaction Log</h3>
              <div className="border border-brand-border rounded-xl overflow-hidden">
                <Table className="w-full text-xs">
                  <TableHeader className="bg-brand-surface border-b border-brand-border">
                    <TableRow>
                      <TableHead className="p-3 text-brand-subtext font-bold uppercase">Date</TableHead>
                      <TableHead className="p-3 text-brand-subtext font-bold uppercase">Merchant</TableHead>
                      <TableHead className="p-3 text-brand-subtext font-bold uppercase">Transaction Amount</TableHead>
                      <TableHead className="p-3 text-brand-subtext font-bold uppercase text-center">Cashback %</TableHead>
                      <TableHead className="p-3 text-brand-subtext font-bold uppercase text-right">Cashback Earned</TableHead>
                      <TableHead className="p-3 text-brand-subtext font-bold uppercase text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="font-semibold text-brand-text">
                    {[
                      { date: "2026-06-20", brand: "Burger House", spent: "₹600.00", pct: "5%", earned: "₹30.00", status: "Approved" },
                      { date: "2026-06-18", brand: "StyleZone", spent: "₹1,500.00", pct: "10%", earned: "₹150.00", status: "Pending" },
                      { date: "2026-06-15", brand: "TechGadgets", spent: "₹800.00", pct: "8%", earned: "₹64.00", status: "Approved" }
                    ].map((row, idx) => (
                      <TableRow key={idx} className="hover:bg-brand-surface border-b border-brand-border last:border-0">
                        <TableCell className="p-3 text-brand-subtext">{row.date}</TableCell>
                        <TableCell className="p-3 font-bold text-brand-navy">{row.brand}</TableCell>
                        <TableCell className="p-3 text-slate-500">{row.spent}</TableCell>
                        <TableCell className="p-3 text-center">{row.pct}</TableCell>
                        <TableCell className="p-3 text-right text-brand-success font-bold">+{row.earned}</TableCell>
                        <TableCell className="p-3 text-center">
                          <Badge className={`border-0 rounded-full text-[9px] font-bold px-2 py-0.5 ${
                            row.status === "Approved" ? "bg-brand-success/15 text-brand-success" : "bg-brand-warning/15 text-brand-warning"
                          }`}>{row.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

          </div>
        )}

        {/* 4. MY ACTIVITY TAB */}
        {activeTab === "activity" && (
          <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-5 max-w-2xl">
            <h3 className="font-heading text-xs font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3">
              Your Chronological Activity
            </h3>
            
            <div className="space-y-5 relative pl-4 border-l border-brand-border">
              {[
                { message: "Checked in at Marbella Home Improvement (Ranchi)", time: "2 hours ago", desc: "Viewed showroom deals in Home Improvement category." },
                { message: "Claimed Burger House BOGOFRIES coupon code", time: "1 day ago", desc: "Redeemed 'Buy One Get One Free Fries' voucher code BURGER30." },
                { message: "Saved StyleZone Summer collection coupon", time: "2 days ago", desc: "Bookmarked '20% off Summer Collection' for in-store purchase." },
                { message: "Voted to revive Zomato Premier coupon", time: "3 days ago", desc: "Submitted an Expired Coupon Revival request for 50% discount codes." },
                { message: "Completed profile preferences settings", time: "10 days ago", desc: "Selected shopping category interests for Homepage customization." }
              ].map((act, idx) => (
                <div key={idx} className="relative space-y-1">
                  {/* Dot */}
                  <div className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-blue border-2 border-white"></div>
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="text-brand-navy">{act.message}</span>
                    <span className="text-[10px] text-brand-subtext font-semibold">{act.time}</span>
                  </div>
                  <p className="text-[10px] text-brand-subtext leading-relaxed">{act.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. NEARBY OFFERS MAP PREVIEW */}
        {activeTab === "nearby" && (
          <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-6">
            <div className="space-y-1.5">
              <h3 className="font-heading text-xs font-bold text-brand-navy uppercase tracking-wider">Nearby Deals Map</h3>
              <p className="text-xs text-brand-subtext leading-normal">
                Explore local deals around Ranchi, Patna, and Delhi. Filter stores by distance and view locations instantly.
              </p>
            </div>

            {/* Custom visual mockup card for Map redirect */}
            <div className="border border-brand-border rounded-xl overflow-hidden bg-brand-surface p-6 text-center space-y-5 max-w-xl mx-auto shadow-sm">
              <div className="w-14 h-14 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center mx-auto">
                <Map className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-navy">Interactive Leaflet Map View</h4>
                <p className="text-[10px] text-brand-subtext max-w-xs mx-auto leading-normal">
                  Toggle dynamic radius filters (1km, 3km, 5km) and discover exclusive local physical store coupons.
                </p>
              </div>
              <Button asChild className="btn-primary py-2 px-5 text-xs font-bold h-auto border-0 cursor-pointer text-white">
                <a href="/nearby-offers">Launch Map Explorer →</a>
              </Button>
            </div>
          </div>
        )}

        {/* 6. SETTINGS VIEW */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            {/* Personal Details */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-heading text-xs font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-1.5"><User className="w-4 h-4 text-brand-blue" /><span>Personal Information</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-brand-text">Full Name</Label>
                  <Input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="bg-brand-surface border-brand-border text-xs" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-brand-text">Email Address</Label>
                  <Input type="email" value={profileData.email} disabled className="bg-brand-surface opacity-60 text-xs cursor-not-allowed" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-brand-text">Phone Number</Label>
                  <Input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="bg-brand-surface border-brand-border text-xs" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-brand-text">City</Label>
                    <InputGroup className="bg-brand-surface border border-brand-border rounded-lg h-10 px-1">
                      <InputGroupAddon><MapPin className="w-3.5 h-3.5 text-brand-subtext" /></InputGroupAddon>
                      <InputGroupInput type="text" placeholder="Ranchi" value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} className="text-xs h-full" />
                    </InputGroup>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-brand-text">State</Label>
                    <Input type="text" placeholder="Jharkhand" value={profileData.state} onChange={(e) => setProfileData({...profileData, state: e.target.value})} className="bg-brand-surface border-brand-border text-xs" />
                  </div>
                </div>
              </div>
            </div>

            {/* Interest categories selection */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-heading text-xs font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-1.5"><Heart className="w-4 h-4 text-brand-blue" /><span>Preferences & Personalization</span></h3>
              <p className="text-[10px] text-brand-subtext">Toggle shopping categories below to filter and sort your Homepage feed.</p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_CATEGORIES.map((cat) => {
                  const isSel = profileData.interests.includes(cat);
                  return (
                    <button
                      key={cat} type="button" onClick={() => handleInterestToggle(cat)}
                      className={`text-[9px] font-bold py-1.5 px-3 rounded-full border cursor-pointer transition-all ${
                        isSel ? "bg-brand-navy text-white border-brand-navy" : "bg-transparent border-brand-border text-brand-subtext hover:border-brand-navy"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notification settings */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-heading text-xs font-bold text-brand-navy uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-1.5"><Bell className="w-4 h-4 text-brand-blue" /><span>Notification Settings</span></h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-text block font-heading">Email Alerts</span>
                    <span className="text-[9px] text-brand-subtext">Weekly campaigns update notification.</span>
                  </div>
                  <Checkbox checked={profileData.emailNotifications} onCheckedChange={(c) => setProfileData({...profileData, emailNotifications: !!c})} />
                </div>
                <hr className="border-brand-border/60" />
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-text block font-heading">SMS Confirmation</span>
                    <span className="text-[9px] text-brand-subtext">Receive instant claim vouchers via SMS.</span>
                  </div>
                  <Checkbox checked={profileData.smsNotifications} onCheckedChange={(c) => setProfileData({...profileData, smsNotifications: !!c})} />
                </div>
                <hr className="border-brand-border/60" />
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-text block font-heading">Expiry warnings</span>
                    <span className="text-[9px] text-brand-subtext">Notify 24 hours prior to coupon expiry.</span>
                  </div>
                  <Checkbox checked={profileData.expiryAlerts} onCheckedChange={(c) => setProfileData({...profileData, expiryAlerts: !!c})} />
                </div>
              </div>
            </div>

            {/* Account deletion warning */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-xs font-bold text-brand-text block font-heading">Delete Account</span>
                <span className="text-[9px] text-brand-subtext">Permanently wipe credentials and savings records.</span>
              </div>
              <Button type="button" variant="outline" onClick={() => setShowDeleteModal(true)} className="text-xs font-bold border-brand-error text-brand-error hover:bg-brand-error/5 flex items-center gap-1 px-3 h-9 cursor-pointer"><Trash2 className="w-4 h-4" /><span>Delete</span></Button>
            </div>

            <Button
              type="submit" disabled={savingSettings}
              className="btn-primary w-full py-3 text-xs font-bold border-0 h-auto cursor-pointer shadow-md text-white flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? "Saving Settings..." : "Save Settings"}</span>
            </Button>
          </form>
        )}

      </div>

      {/* Confirmation Modal */}
      {selectedSavedCoupon && (
        <ConfirmationModal
          coupon={selectedSavedCoupon}
          onClose={() => setSelectedSavedCoupon(null)}
          onConfirm={handleRedeemConfirm}
        />
      )}

      {/* Account deletion modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-[250] flex items-center justify-center p-4 animate-fade-in-scale">
          <div className="bg-white border border-brand-border rounded-2xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-brand-error/15 text-brand-error flex items-center justify-center mx-auto border border-brand-error/30">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-brand-navy">Delete Account?</h3>
              <p className="text-xs text-brand-subtext leading-relaxed">
                This will permanently delete your user profile and wipe all tracked savings. This action is irreversible.
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={() => setShowDeleteModal(false)} variant="outline" className="btn-tertiary flex-1 py-2 text-xs font-bold border-brand-border h-auto cursor-pointer">Cancel</Button>
              <Button type="button" onClick={() => { toast.error("Action restricted in demo."); setShowDeleteModal(false); }} className="bg-brand-error hover:bg-red-700 text-white flex-1 py-2 text-xs font-bold border-0 h-auto cursor-pointer">Delete Profile</Button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
