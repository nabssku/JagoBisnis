import React, { useState } from 'react';
import { ChartDataPoint, ReferrerInfo, ProductViewInfo } from '@/services/analytics.service';
import { Globe, ArrowUpRight, TrendingUp } from 'lucide-react';

interface ChartsProps {
  chartData: ChartDataPoint[];
  topReferrers: ReferrerInfo[];
  topProducts: ProductViewInfo[];
}

export function AnalyticsCharts({ chartData, topReferrers, topProducts }: ChartsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart configurations
  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;

  const validData = chartData && chartData.length > 0 ? chartData : [
    { date: 'Tdk ada data', views: 0, visitors: 0, orders: 0, revenue: 0 }
  ];

  const maxViews = Math.max(...validData.map(d => d.views), 10);
  const maxVisitors = Math.max(...validData.map(d => d.visitors), 10);
  const maxValue = Math.max(maxViews, maxVisitors);

  // Helper to map index & value to SVG coordinate
  const getCoords = (index: number, val: number) => {
    const totalPoints = validData.length;
    const x = paddingX + (index * (width - 2 * paddingX)) / Math.max(totalPoints - 1, 1);
    const y = height - paddingY - (val * (height - 2 * paddingY)) / maxValue;
    return { x, y };
  };

  // Generate paths
  let viewsPath = '';
  let visitorsPath = '';
  let viewsArea = '';
  let visitorsArea = '';

  if (validData.length > 0) {
    // Views Line
    const firstPin = getCoords(0, validData[0].views);
    viewsPath = `M ${firstPin.x} ${firstPin.y}`;
    viewsArea = `M ${firstPin.x} ${height - paddingY} L ${firstPin.x} ${firstPin.y}`;
    
    for (let i = 1; i < validData.length; i++) {
      const pin = getCoords(i, validData[i].views);
      viewsPath += ` L ${pin.x} ${pin.y}`;
      viewsArea += ` L ${pin.x} ${pin.y}`;
    }
    
    const lastPin = getCoords(validData.length - 1, validData[validData.length - 1].views);
    viewsArea += ` L ${lastPin.x} ${height - paddingY} Z`;

    // Visitors Line
    const firstVis = getCoords(0, validData[0].visitors);
    visitorsPath = `M ${firstVis.x} ${firstVis.y}`;
    visitorsArea = `M ${firstVis.x} ${height - paddingY} L ${firstVis.x} ${firstVis.y}`;
    
    for (let i = 1; i < validData.length; i++) {
      const pin = getCoords(i, validData[i].visitors);
      visitorsPath += ` L ${pin.x} ${pin.y}`;
      visitorsArea += ` L ${pin.x} ${pin.y}`;
    }
    
    const lastVis = getCoords(validData.length - 1, validData[validData.length - 1].visitors);
    visitorsArea += ` L ${lastVis.x} ${height - paddingY} Z`;
  }

  // Format date to local Indonesian month
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.includes('Tdk')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    return `${parts[2]}/${parts[1]}`;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Chart Section */}
      <div className="lg:col-span-2 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              Tren Kunjungan Toko
            </h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
              Statistik harian pengunjung dan page views
            </p>
          </div>
          
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-gray-600 dark:text-zinc-400">Hubungan Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-gray-600 dark:text-zinc-400">Pengunjung Unik</span>
            </div>
          </div>
        </div>

        {/* SVG Render */}
        <div className="relative pt-4 overflow-visible">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid Lines */}
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} className="stroke-gray-100 dark:stroke-zinc-850 stroke-1 stroke-dashed" />
            <line x1={paddingX} y1={(paddingY + height - paddingY) / 2} x2={width - paddingX} y2={(paddingY + height - paddingY) / 2} className="stroke-gray-100 dark:stroke-zinc-850 stroke-1 stroke-dashed" />
            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} className="stroke-gray-200 dark:stroke-zinc-800 stroke-1" />

            {/* Area Fills */}
            <path d={viewsArea} fill="url(#views-gradient)" className="opacity-15" />
            <path d={visitorsArea} fill="url(#visitors-gradient)" className="opacity-10" />

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="views-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="visitors-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Trend Lines */}
            <path d={viewsPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={visitorsPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Interactive Circles & Hover Overlay */}
            {validData.map((d, i) => {
              const viewCoords = getCoords(i, d.views);
              const visitorCoords = getCoords(i, d.visitors);
              const isHovered = hoveredIndex === i;

              return (
                <g key={i} className="cursor-pointer">
                  {/* Invisible wide hover target line */}
                  <line 
                    x1={viewCoords.x} 
                    y1={paddingY} 
                    x2={viewCoords.x} 
                    y2={height - paddingY} 
                    stroke="transparent" 
                    strokeWidth="12" 
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />

                  {/* Vertical hover alignment indicator */}
                  {isHovered && (
                    <line 
                      x1={viewCoords.x} 
                      y1={paddingY} 
                      x2={viewCoords.x} 
                      y2={height - paddingY} 
                      className="stroke-gray-300 dark:stroke-zinc-700 stroke-1" 
                    />
                  )}

                  {/* Views Circle */}
                  <circle 
                    cx={viewCoords.x} 
                    cy={viewCoords.y} 
                    r={isHovered ? 5 : 2} 
                    fill="#f59e0b" 
                    stroke={isHovered ? '#fff' : 'none'} 
                    strokeWidth="1.5"
                    className="transition-all"
                  />

                  {/* Visitors Circle */}
                  <circle 
                    cx={visitorCoords.x} 
                    cy={visitorCoords.y} 
                    r={isHovered ? 4.5 : 1.5} 
                    fill="#3b82f6" 
                    stroke={isHovered ? '#fff' : 'none'} 
                    strokeWidth="1"
                    className="transition-all"
                  />
                </g>
              );
            })}

            {/* X-axis labels (Start, End) */}
            <text x={paddingX} y={height - 4} className="fill-gray-400 dark:fill-zinc-600 text-[9px] font-black font-sans uppercase">
              {formatDate(validData[0].date)}
            </text>
            <text x={width - paddingX} y={height - 4} textAnchor="end" className="fill-gray-400 dark:fill-zinc-600 text-[9px] font-black font-sans uppercase">
              {formatDate(validData[validData.length - 1].date)}
            </text>
          </svg>

          {/* Interactive Info card overlay */}
          {hoveredIndex !== null && validData[hoveredIndex] && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 animate-fade-in bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border dark:border-zinc-200 text-[10px] font-bold p-2.5 rounded-2xl flex gap-4 shadow-xl z-20">
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 dark:text-zinc-500 text-[8px] uppercase tracking-wider">Tanggal</span>
                <span className="font-extrabold">{validData[hoveredIndex].date}</span>
              </div>
              <div className="h-6 w-px bg-zinc-800 dark:bg-zinc-200 align-middle self-center" />
              <div className="flex flex-col gap-0.5">
                <span className="text-amber-400 dark:text-amber-600 text-[8px] uppercase tracking-wider">Pageviews</span>
                <span className="font-extrabold text-amber-500">{validData[hoveredIndex].views}x</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-blue-400 dark:text-blue-600 text-[8px] uppercase tracking-wider">Unik Visitor</span>
                <span className="font-extrabold text-blue-500">{validData[hoveredIndex].visitors}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Referrals & Top Products Lists */}
      <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl p-8 space-y-6 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-amber-500" />
              Sumber Rujukan
            </h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
              Asal trafik pengunjung toko online kamu
            </p>
          </div>

          <div className="space-y-3">
            {topReferrers.length === 0 ? (
              <p className="text-xs font-semibold text-muted-foreground italic">Belum ada data rujukan.</p>
            ) : (
              topReferrers.map((ref, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-zinc-900 last:border-0">
                  <span className="text-xs font-semibold truncate text-gray-800 dark:text-zinc-300 max-w-[160px]">{ref.referrer}</span>
                  <span className="text-[10px] font-extrabold px-3 py-1 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-750 text-gray-600 dark:text-zinc-350 rounded-lg">{ref.count} view</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-5 pt-4 border-t border-gray-100 dark:border-zinc-850">
          <div className="space-y-1">
            <h3 className="text-xs font-black tracking-widest text-gray-400 dark:text-zinc-500 uppercase">
              Produk Paling Populer
            </h3>
          </div>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-xs font-semibold text-muted-foreground italic">Belum ada view produk.</p>
            ) : (
              topProducts.map((prod, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="text-xs font-semibold truncate text-gray-800 dark:text-zinc-300 max-w-[160px] flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded">{idx + 1}</span>
                    {prod.name}
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-600 flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full select-none">
                    {prod.views}x
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
