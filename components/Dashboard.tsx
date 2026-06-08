import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconDotsVertical, 
  IconCode, 
  IconTerminal, 
  IconX, 
  IconInfoCircle, 
  IconExternalLink 
} from '@tabler/icons-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { cn } from '../utils';
import { DashboardCard as CardProps } from '../types';
import Sparkline from './Sparkline';

// Use the exact semantic hospitality color tokens defined in index.css
const COLORS = [
  'var(--base-color-4)', // Light blue (smoke)
  'var(--base-color-5)', // Yellow (accent-gold)
  'var(--base-color-6)', // Orange (lagging / amber highlight)
  'var(--base-color-7)', // Red (action / alert crimson)
  'var(--base-color-8)'  // Purple (grape metrics)
];

export const DashboardCardComponent: React.FC<CardProps> = ({ 
  title, subtitle, data, visualization, actions, footer, width = 'full', codeSnippet, developerNotes 
}) => {
  const [showSpec, setShowSpec] = useState(false);
  const containerWidthClass = {
    full: 'col-span-full',
    half: 'md:col-span-1 col-span-full',
    third: 'lg:col-span-1 md:col-span-1 col-span-full'
  }[width];

  const renderVisualization = () => {
    if (!data) return <div className="h-48 flex items-center justify-center text-[10px] text-[var(--secondary)] italic font-eyebrow uppercase tracking-wider">No active data stream</div>;

    switch (visualization) {
      case 'bar': {
        const barData = Array.isArray(data) ? data : [];
        if (barData.length === 0) return <div className="h-48 bg-[var(--background)] flex items-center justify-center text-[10px] text-[var(--secondary)] italic font-eyebrow tracking-wider uppercase">No segment data mapped</div>;
        return (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.15} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--secondary)', fontFamily: 'var(--font-brand)' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--secondary)', fontFamily: 'var(--font-numbers)' }} 
                />
                <Tooltip 
                  cursor={{ fill: 'var(--background)', opacity: 0.5 }} 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '2px solid var(--border)', 
                    backgroundColor: 'var(--card)',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-brand)',
                    fontSize: '10px',
                    boxShadow: '4px 4px 0px var(--border)'
                  }} 
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--base-color-6)" // Orange brand highlight
                  radius={[4, 4, 0, 0]} 
                  barSize={width === 'third' ? 20 : 32}
                />
                {barData[0]?.value2 && (
                  <Bar 
                    dataKey="value2" 
                    fill="var(--base-primary)" // Dark blue/navy color
                    radius={[4, 4, 0, 0]} 
                    barSize={width === 'third' ? 20 : 32}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      }
      case 'velocity':
      case 'line': {
        const lineData = Array.isArray(data) ? data : [];
        if (lineData.length === 0) return <div className="h-48 bg-[var(--background)] flex items-center justify-center text-[10px] text-[var(--secondary)] italic font-eyebrow tracking-wider uppercase">No trend data available</div>;
        return (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.15} />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '2px solid var(--border)', 
                    backgroundColor: 'var(--card)',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-brand)',
                    fontSize: '10px',
                    boxShadow: '4px 4px 0px var(--border)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={visualization === 'velocity' ? "var(--base-color-6)" : "var(--base-color-3)"} 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 5, fill: 'var(--foreground)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      }
      case 'pie': {
        const pieData = Array.isArray(data) ? data : [];
        if (pieData.length === 0) return <div className="h-48 bg-[var(--background)] flex items-center justify-center text-[10px] text-[var(--secondary)] italic font-eyebrow tracking-wider uppercase">No distribution data</div>;
        return (
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={2} stroke="var(--card)" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none font-brand">
              <span className="text-2xl font-black text-[var(--foreground)] tracking-tighter italic font-numbers">
                {pieData.reduce((a: any, b: any) => a + (Number(b.value) || 0), 0).toLocaleString()}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--secondary)] font-eyebrow">Total Volume</span>
            </div>
          </div>
        );
      }
      case 'progress': {
          const progressData = Array.isArray(data) ? data : [];
          return (
            <div className="space-y-4 py-4 font-brand">
              {progressData.map((item: any, i: number) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black text-[var(--foreground)] uppercase tracking-wider font-eyebrow">
                    <span>{item.name}</span>
                    <span className="bg-[var(--background)] border border-[var(--border)] px-1.5 py-0.5 rounded font-numbers">{item.value}%</span>
                  </div>
                  <div className="h-3 w-full bg-[var(--background)] border border-[var(--border)] rounded overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-[var(--base-color-6)] border-r-2 border-[var(--border)]" 
                    />
                  </div>
                </div>
              ))}
            </div>
          );
      }
      case 'metric-only': {
        return (
          <div className="py-2 space-y-4 font-brand">
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-[var(--foreground)] tracking-tighter italic font-numbers">{data.value || "---"}</span>
                {data.trend && (
                  <div 
                    className="flex items-center text-[10px] font-black px-2 py-1 rounded-lg border-2 font-numbers"
                    style={{
                      color: data.trend.isUp ? 'var(--base-color-3)' : 'var(--base-color-7)',
                      backgroundColor: data.trend.isUp ? 'var(--base-color-3-fade)' : 'var(--base-color-7-fade)',
                      borderColor: 'var(--border)',
                      boxShadow: '2px 2px 0px var(--border)'
                    }}
                  >
                    {data.trend.isUp ? <IconTrendingUp size={12} className="mr-1" /> : <IconTrendingDown size={12} className="mr-1" />}
                    {data.trend.value}%
                  </div>
                )}
              </div>
              {data.sparkline && Array.isArray(data.sparkline) && (
                <div className="flex items-center bg-[var(--background)] border border-[var(--border)] px-2.5 py-1.5 rounded-lg shadow-[2px_2px_0px_var(--border)]">
                  {/* Straight lines with bold line 3px and solid fill background token rendering */}
                  <Sparkline 
                    data={data.sparkline} 
                    width={75} 
                    height={20} 
                    strokeWidth={3} 
                    fillType="solid" 
                  />
                </div>
              )}
            </div>
            {data.list && Array.isArray(data.list) && (
              <div className="space-y-2 pt-4 border-t-2 border-[var(--background)]">
                {data.list.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center group">
                    <span className="text-[10px] font-black text-[var(--secondary)] uppercase tracking-wider font-eyebrow">{item.label}</span>
                    <div className="flex items-center gap-4">
                      {item.sparkline && Array.isArray(item.sparkline) && (
                        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                          {/* Inline sparklines within KPI list blocks using bold 2.5px straight transparent fill style */}
                          <Sparkline 
                            data={item.sparkline} 
                            width={45} 
                            height={12} 
                            strokeWidth={2.5} 
                            fillType="transparent" 
                            showEndpointCircle={false} 
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[var(--foreground)] font-numbers">{item.value}</span>
                        {item.trend !== undefined && (
                          <span 
                            className="text-[9px] font-black px-1.5 py-0.5 rounded border font-numbers"
                            style={{
                              color: item.trend >= 0 ? 'var(--base-color-3)' : 'var(--base-color-7)',
                              backgroundColor: item.trend >= 0 ? 'var(--base-color-3-fade)' : 'var(--base-color-7-fade)',
                              borderColor: 'var(--border)'
                            }}
                          >
                            {item.trend >= 0 ? '↑' : '↓'} {Math.abs(item.trend)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      default:
        return <div className="h-48 flex items-center justify-center text-[10px] font-black text-[var(--secondary)] italic font-eyebrow tracking-wider uppercase">Visualization Engine Unavailable</div>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-[var(--card)] border-2 border-[var(--border)] rounded-xl overflow-hidden shadow-[4px_4px_0px_var(--border)] flex flex-col relative group font-sans",
        containerWidthClass
      )}
    >
      <div className="p-5 flex-1 relative">
        <div className="flex justify-between items-start mb-1 font-brand">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-[var(--foreground)] leading-tight tracking-tight text-lg uppercase font-display">{title}</h3>
              <button 
                onClick={() => setShowSpec(!showSpec)}
                className="p-1 hover:bg-[var(--background)] rounded text-[var(--secondary)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                title="View Component Specs"
              >
                <IconCode size={12} />
              </button>
            </div>
            {subtitle && <p className="text-xs text-[var(--secondary)] font-medium font-eyebrow uppercase tracking-wide">{subtitle}</p>}
          </div>
          <button className="text-[var(--secondary)] hover:text-[var(--foreground)] cursor-pointer">
            <IconDotsVertical size={18} />
          </button>
        </div>

        <div className="mt-4 min-h-[16rem]">
          {renderVisualization()}
        </div>

        <AnimatePresence>
          {showSpec && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-[var(--background)] p-6 z-30 overflow-y-auto custom-scrollbar border-2 border-[var(--border)] rounded-lg font-brand"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-[var(--base-color-8)]">
                  <IconTerminal size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] font-eyebrow">Developer Spec</span>
                </div>
                <button onClick={() => setShowSpec(false)} className="text-[var(--secondary)] hover:text-[var(--foreground)] cursor-pointer">
                  <IconX size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-[var(--card)] border border-[var(--border)] shadow-[2px_2px_0px_var(--border)] rounded-lg">
                  <div className="flex items-center gap-1.5 mb-2 text-[var(--foreground)]">
                    <IconInfoCircle size={12} />
                    <span className="text-[10px] font-black uppercase font-eyebrow">Implementation Notes</span>
                  </div>
                  <p className="text-[11px] text-[var(--secondary)] leading-relaxed italic">
                    {developerNotes || "On-brand SaaS BI design utilizing absolute coordinates and exact custom styling variables."}
                  </p>
                </div>

                <div className="space-y-2">
                   <span className="text-[10px] font-black text-[var(--foreground)] uppercase font-eyebrow tracking-wider block">React Blueprint</span>
                   <div className="p-3 bg-[var(--card)] rounded-lg border border-[var(--border)] font-mono text-[9px] text-[var(--foreground)] whitespace-pre-wrap leading-tight overflow-x-auto">
                     {codeSnippet || "// SaaS BI Component Blueprint\n<Card className=\"border-2 shadow\" />"}
                   </div>
                </div>

                <button 
                  onClick={() => navigator.clipboard.writeText(codeSnippet || "")}
                  className="w-full flex items-center justify-center gap-2 py-2 border-2 border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background)] text-[var(--foreground)] shadow-[3px_3px_0px_var(--border)] active:shadow-none translate-y-[-2px] active:translate-y-0 text-[10px] font-black uppercase tracking-widest transition-all font-buttons"
                >
                  Copy Component Code
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(actions || footer) && (
        <div className="px-5 py-4 bg-[var(--background)] border-t border-[var(--border)] flex justify-between items-center gap-3 font-brand">
          <div className="text-[10px] font-black text-[var(--secondary)] uppercase tracking-widest truncate font-eyebrow">
            {footer}
          </div>
          <div className="flex gap-2">
            {actions?.map((action, i) => (
              <button 
                key={i} 
                className="px-4 py-1.5 border-2 border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background)] text-xs font-black text-[var(--foreground)] shadow-[2px_2px_0px_var(--border)] active:shadow-none translate-y-[-2px] active:translate-y-0 transition-all flex items-center gap-1.5 uppercase tracking-wide font-buttons"
              >
                {action}
                {action === 'Details' && <IconExternalLink size={12} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
