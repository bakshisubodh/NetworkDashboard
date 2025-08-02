import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Calendar } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const InteractiveTimeline = ({ 
  data, 
  title, 
  color = 'blue',
  height = 300,
  showZoom = true,
  className = ''
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef(null);

  const maxZoom = 3;
  const minZoom = 0.5;

  const handleZoomIn = () => {
    if (zoomLevel < maxZoom) {
      setZoomLevel(prev => Math.min(prev + 0.5, maxZoom));
      setIsZoomed(true);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > minZoom) {
      setZoomLevel(prev => Math.max(prev - 0.5, minZoom));
      if (zoomLevel <= 1.5) {
        setIsZoomed(false);
      }
    }
  };

  const handleReset = () => {
    setZoomLevel(1);
    setIsZoomed(false);
    setSelectedPoint(null);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-700',
        gradient: 'from-blue-400 to-blue-600'
      },
      green: {
        bg: 'bg-green-500',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-700',
        gradient: 'from-green-400 to-green-600'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-700',
        gradient: 'from-purple-400 to-purple-600'
      },
      orange: {
        bg: 'bg-orange-500',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-700',
        gradient: 'from-orange-400 to-orange-600'
      },
      red: {
        bg: 'bg-red-500',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-700',
        gradient: 'from-red-400 to-red-600'
      }
    };
    return colors[color] || colors.blue;
  };

  const colorClasses = getColorClasses(color);

  // Filter data based on zoom level
  const getFilteredData = () => {
    if (!data || data.length === 0) return [];
    
    if (zoomLevel <= 1) {
      // Show every 3rd point for overview
      return data.filter((_, index) => index % 3 === 0);
    } else if (zoomLevel <= 2) {
      // Show every 2nd point for medium zoom
      return data.filter((_, index) => index % 2 === 0);
    } else {
      // Show all points for high zoom
      return data;
    }
  };

  const filteredData = getFilteredData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Day {label}
          </p>
          <p className={`text-sm font-bold ${colorClasses.text}`}>
            {payload[0].value}%
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className={`w-5 h-5 ${colorClasses.text}`} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {isZoomed && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"
            >
              {zoomLevel.toFixed(1)}x
            </motion.span>
          )}
        </div>

        {showZoom && (
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleZoomOut}
              disabled={zoomLevel <= minZoom}
              className={`p-2 rounded-lg border ${colorClasses.border} hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <ZoomOut className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleZoomIn}
              disabled={zoomLevel >= maxZoom}
              className={`p-2 rounded-lg border ${colorClasses.border} hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <ZoomIn className="w-4 h-4" />
            </motion.button>

            {isZoomed && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Chart Container */}
      <motion.div
        ref={containerRef}
        className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
        style={{ height }}
        animate={{
          scale: zoomLevel > 1 ? 1.02 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorClasses.bg} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colorClasses.bg} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="day" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={colorClasses.bg} 
              fill={`url(#gradient-${title})`}
              strokeWidth={zoomLevel > 1.5 ? 3 : 2}
              dot={zoomLevel > 2 ? { fill: colorClasses.bg, strokeWidth: 2, r: 4 } : false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Zoom indicator */}
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded"
          >
            {zoomLevel.toFixed(1)}x
          </motion.div>
        )}

        {/* Data points overlay for high zoom */}
        {zoomLevel > 2 && (
          <div className="absolute inset-0 pointer-events-none">
            {filteredData.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="absolute w-2 h-2 bg-white border-2 border-blue-500 rounded-full"
                style={{
                  left: `${(index / (filteredData.length - 1)) * 100}%`,
                  top: `${100 - point.value}%`,
                  transform: 'translate(-50%, 50%)'
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data && data.length > 0 ? Math.max(...data.map(d => d.value)) : 0}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Peak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data && data.length > 0 ? Math.min(...data.map(d => d.value)) : 0}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Low</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data && data.length > 0 
              ? Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)
              : 0}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Avg</div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTimeline; 