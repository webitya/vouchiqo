import React from "react";

export function TrafficSources() {
  return (
    <div
      data-slot="card"
      className="rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow duration-200"
    >
      <div
        data-slot="card-header"
        className="flex flex-col space-y-1.5 p-6 pb-2"
      >
        <div className="tracking-tight text-base font-semibold">
          Traffic Sources
        </div>
        <p className="text-xs text-muted-foreground">
          Where your visitors come from
        </p>
      </div>
      <div data-slot="card-content" className="p-6 pt-0">
        <div className="flex items-center gap-4">
          <div className="relative h-36 w-36 shrink-0">
            <div
              className="recharts-responsive-container"
              style={{ width: "100%", height: "100%", minWidth: "0px" }}
            >
              <div
                style={{
                  width: "0px",
                  height: "0px",
                  overflow: "visible",
                }}
              >
                <div
                  width="144"
                  height="144"
                  className="recharts-wrapper"
                  style={{
                    position: "relative",
                    cursor: "default",
                    width: "144px",
                    height: "144px",
                  }}
                >
                  <svg
                    cx="50%"
                    cy="50%"
                    role="application"
                    className="recharts-surface"
                    width="144"
                    height="144"
                    viewBox="0 0 144 144"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                    }}
                  >
                    <g className="recharts-layer recharts-pie">
                      <g className="recharts-layer">
                        <g className="recharts-layer recharts-pie-sector">
                          <path
                            cx="72"
                            cy="72"
                            strokeWidth="0"
                            fill="#3e80dd"
                            stroke="#fff"
                            name="Direct"
                            d="M 137,72 A 65,65,0,0,0,37.7479,16.757 L 49.8679,36.3045 A 42,42,0,0,1,114,72 Z"
                          />
                        </g>
                        <g className="recharts-layer recharts-pie-sector">
                          <path
                            cx="72"
                            cy="72"
                            strokeWidth="0"
                            fill="#2563eb"
                            stroke="#fff"
                            name="Organic"
                            d="M 34.9036,18.6253 A 65,65,0,0,0,23.8782,115.6954 L 40.9059,100.234 A 42,42,0,0,1,48.03,37.5117 Z"
                          />
                        </g>
                        <g className="recharts-layer recharts-pie-sector">
                          <path
                            cx="72"
                            cy="72"
                            strokeWidth="0"
                            fill="#0a2e6e"
                            stroke="#fff"
                            name="Referral"
                            d="M 26.231,118.1541 A 65,65,0,0,0,106.2521,127.243 L 94.1321,107.6955 A 42,42,0,0,1,42.4262,101.8226 Z"
                          />
                        </g>
                        <g className="recharts-layer recharts-pie-sector">
                          <path
                            cx="72"
                            cy="72"
                            strokeWidth="0"
                            fill="#2563eb"
                            stroke="#fff"
                            name="Social"
                            d="M 109.0964,125.3747 A 65,65,0,0,0,136.9109,75.4018 L 113.9424,74.1981 A 42,42,0,0,1,95.97,106.4883 Z"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-lg font-bold text-slate-800">
                284K
              </span>
              <span className="text-[10px] text-muted-foreground">
                Visits
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#3e80dd]"></div>
                <span className="text-xs text-muted-foreground">
                  Direct
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-700">
                35%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#2563eb]"></div>
                <span className="text-xs text-muted-foreground">
                  Organic
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-700">
                28%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#0a2e6e]"></div>
                <span className="text-xs text-muted-foreground">
                  Referral
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-700">
                22%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#2563eb]"></div>
                <span className="text-xs text-muted-foreground">
                  Social
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-700">
                15%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrafficSources;
