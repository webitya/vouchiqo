import React from "react";
import { DollarSign, Store, Tag, TrendingDown, TrendingUp, Users } from "lucide-react";
import Sparkline from "./Sparkline";

export function KpisGrid({ kpis }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Card 1: Monthly SaaS Revenue */}
      <div
        data-slot="card"
        className="rounded-xl border bg-card text-card-foreground shadow-sm group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20"
      >
        <div data-slot="card-content" className="p-5 pb-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Total Revenue
              </p>
              <p className="text-2xl font-bold tracking-tight">
                ${kpis.monthlyRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-600">
                  +12.5%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last month
                </span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 bg-[#2563eb]/10">
              <DollarSign className="h-5 w-5 text-[#2563eb]" />
            </div>
          </div>
        </div>
        <div className="h-12 w-full mt-3">
          <Sparkline
            points={[35, 38, 36, 42, 49, 45, 52, 58, 62, 59, 65, 74]}
            color="#2563eb"
            id="revenue"
          />
        </div>
      </div>

      {/* Card 2: Active Users */}
      <div
        data-slot="card"
        className="rounded-xl border bg-card text-card-foreground shadow-sm group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20"
      >
        <div data-slot="card-content" className="p-5 pb-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Active Users
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {kpis.totalUsers.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-600">
                  +8.2%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last month
                </span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 bg-[#2563eb]/10">
              <Users className="h-5 w-5 text-[#2563eb]" />
            </div>
          </div>
        </div>
        <div className="h-12 w-full mt-3">
          <Sparkline
            points={[20, 24, 22, 28, 34, 31, 38, 41, 46, 43, 49, 55]}
            color="#2563eb"
            id="users"
          />
        </div>
      </div>

      {/* Card 3: Active Coupons */}
      <div
        data-slot="card"
        className="rounded-xl border bg-card text-card-foreground shadow-sm group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20"
      >
        <div data-slot="card-content" className="p-5 pb-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Total Orders
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {kpis.activeCoupons.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
                <span className="text-xs font-semibold text-rose-600">
                  -3.1%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last month
                </span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 bg-[#3e80dd]/10">
              <Tag className="h-5 w-5 text-[#3e80dd]" />
            </div>
          </div>
        </div>
        <div className="h-12 w-full mt-3">
          <Sparkline
            points={[45, 42, 40, 38, 35, 32, 29, 33, 31, 30, 27, 25]}
            color="#3e80dd"
            id="orders"
          />
        </div>
      </div>

      {/* Card 4: Registered Merchants */}
      <div
        data-slot="card"
        className="rounded-xl border bg-card text-card-foreground shadow-sm group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20"
      >
        <div data-slot="card-content" className="p-5 pb-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Page Views
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {kpis.totalMerchants}
              </p>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-600">
                  +24.7%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last month
                </span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 bg-[#eab308]/10">
              <Store className="h-5 w-5 text-[#eab308]" />
            </div>
          </div>
        </div>
        <div className="h-12 w-full mt-3">
          <Sparkline
            points={[15, 18, 16, 21, 26, 23, 29, 34, 38, 36, 42, 48]}
            color="#eab308"
            id="views"
          />
        </div>
      </div>
    </div>
  );
}

export default KpisGrid;
