import React from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricWidget = ({ 
  title, 
  value, 
  unit = '', 
  trend, 
  color = 'primary',
  showChart = false,
  chartData = [],
  subtitle = '',
  className = ''
}) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-success-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-danger-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-success-600';
    if (trend < 0) return 'text-danger-600';
    return 'text-gray-600';
  };

  const colorClasses = {
    primary: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    danger: 'text-danger-600',
    gray: 'text-gray-600'
  };

  return (
    <div className={`metric-card ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {trend !== undefined && (
          <div className="flex items-center space-x-1">
            {getTrendIcon(trend)}
            <span className={`text-xs font-medium ${getTrendColor(trend)}`}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-baseline space-x-2">
        <span className={`text-2xl font-bold ${colorClasses[color]}`}>
          {value}
        </span>
        {unit && (
          <span className="text-sm text-gray-500">{unit}</span>
        )}
      </div>
      
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
      
      {showChart && chartData.length > 0 && (
        <div className="mt-4 h-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorClasses[color].replace('text-', '')} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colorClasses[color].replace('text-', '')} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colorClasses[color].replace('text-', '')} 
                fill={`url(#gradient-${title})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MetricWidget; 