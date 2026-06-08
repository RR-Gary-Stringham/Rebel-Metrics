import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number; // Bold line defaults to 3px
  color?: string; // Brand variable e.g., 'var(--base-color-6)'
  strokeLinecap?: 'round' | 'butt' | 'square';
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
  fillType?: 'transparent' | 'solid'; // Either transparent or solid fill under the line
  showEndpointCircle?: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 85,
  height = 24,
  strokeWidth = 3, // Bold line 3px by default
  color,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  fillType = 'transparent', // Default to transparent fill (no background color blocking)
  showEndpointCircle = true,
  className = '',
}) => {
  if (!data || data.length < 2) {
    return null;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  // Compute precise grid points
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    // Keep padding to fit stroke width and prevent cutoffs in SVG boundaries
    const padding = strokeWidth / 2 + 1;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return { x, y };
  });

  // Sharp straight line connection logic (no curves)
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  // Underline fill path
  const fillD = `${pathD} L ${width.toFixed(1)} ${height.toFixed(1)} L 0 ${height.toFixed(1)} Z`;

  // Use brand colors from index.css by default:
  // Up/Growth trend: Light Teal (var(--base-color-3))
  // Down trend: Crimson Red (var(--base-color-7))
  const isTrendUp = data[data.length - 1] >= data[0];
  const strokeColor = color || (isTrendUp ? 'var(--base-color-3)' : 'var(--base-color-7)');

  const lastPoint = points[points.length - 1];

  return (
    <span className={`inline-flex items-center select-none ${className}`} style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Subtle horizontal grid guide for high-fidelity SaaS alignment */}
        <line 
          x1="0" 
          y1={height / 2} 
          x2={width} 
          y2={height / 2} 
          stroke="var(--border)" 
          strokeWidth="0.5" 
          strokeDasharray="2 3" 
          opacity={0.08}
        />

        {/* Brand Fill under the line (Solid color at soft opacity vs Transparent) */}
        {fillType === 'solid' && (
          <path
            d={fillD}
            fill={strokeColor}
            fillOpacity={0.15}
            stroke="none"
            pointerEvents="none"
          />
        )}

        {/* Sparkline track segment */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          strokeLinejoin={strokeLinejoin}
          pointerEvents="none"
        />

        {/* Precise trend endpoint marker */}
        {showEndpointCircle && lastPoint && (
          <>
            {/* Ambient outer pulse ring */}
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r={strokeWidth * 1.2}
              fill={strokeColor}
              opacity={0.25}
              className="animate-ping"
              style={{ transformOrigin: `${lastPoint.x}px ${lastPoint.y}px` }}
            />
            {/* Central focused dot */}
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r={strokeWidth * 0.7}
              fill={strokeColor}
              stroke="var(--card)"
              strokeWidth={1}
            />
          </>
        )}
      </svg>
    </span>
  );
};

export default Sparkline;
