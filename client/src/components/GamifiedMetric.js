import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

const GamifiedMetric = ({ 
  title, 
  value, 
  unit = '', 
  maxValue = 100,
  trend,
  color = 'primary',
  icon: Icon = Zap,
  subtitle = '',
  className = '',
  showProgress = true,
  size = 'medium'
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const getColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'bg-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
        ring: 'stroke-blue-500',
        fill: 'fill-blue-500'
      },
      success: {
        bg: 'bg-green-500',
        text: 'text-green-600 dark:text-green-400',
        ring: 'stroke-green-500',
        fill: 'fill-green-500'
      },
      warning: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-600 dark:text-yellow-400',
        ring: 'stroke-yellow-500',
        fill: 'fill-yellow-500'
      },
      danger: {
        bg: 'bg-red-500',
        text: 'text-red-600 dark:text-red-400',
        ring: 'stroke-red-500',
        fill: 'fill-red-500'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-600 dark:text-purple-400',
        ring: 'stroke-purple-500',
        fill: 'fill-purple-500'
      }
    };
    return colors[color] || colors.primary;
  };

  const getSizeClasses = (size) => {
    const sizes = {
      small: {
        container: 'w-28 h-28',
        ring: 'w-20 h-20',
        text: 'text-lg',
        icon: 'w-5 h-5',
        title: 'text-xs'
      },
      medium: {
        container: 'w-36 h-36',
        ring: 'w-28 h-28',
        text: 'text-2xl',
        icon: 'w-7 h-7',
        title: 'text-sm'
      },
      large: {
        container: 'w-44 h-44',
        ring: 'w-36 h-36',
        text: 'text-3xl',
        icon: 'w-9 h-9',
        title: 'text-base'
      }
    };
    return sizes[size] || sizes.medium;
  };

  const colorClasses = getColorClasses(color);
  const sizeClasses = getSizeClasses(size);

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`relative ${sizeClasses.container} ${className} bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 p-2`}
    >
      {/* Background Ring */}
      <div className={`absolute inset-0 rounded-full ${colorClasses.bg} opacity-5`}></div>
      
      {/* Progress Ring */}
      {showProgress && (
        <svg className={`absolute inset-0 ${sizeClasses.ring} transform -rotate-90`}>
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className={colorClasses.ring}
            initial={{ strokeDasharray: "0 283" }}
            animate={{ strokeDasharray: `${(percentage / 100) * 283} 283` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </svg>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Icon */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`${colorClasses.text} ${sizeClasses.icon} mb-1`}
        >
          <Icon />
        </motion.div>

        {/* Value */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`${colorClasses.text} ${sizeClasses.text} font-bold leading-none`}
        >
          {typeof value === 'number' ? value.toFixed(1) : value}{unit}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`${sizeClasses.title} text-gray-600 dark:text-gray-400 text-center px-1 leading-tight`}
        >
          {title}
        </motion.div>

        {/* Trend */}
        {trend !== undefined && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="flex items-center space-x-1 mt-1"
          >
            {getTrendIcon(trend)}
            <span className={`text-xs font-medium ${getTrendColor(trend)}`}>
              {Math.abs(trend).toFixed(1)}%
            </span>
          </motion.div>
        )}
      </div>

      {/* Floating particles for high values */}
      {percentage > 80 && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1.5 h-1.5 ${colorClasses.bg} rounded-full shadow-sm`}
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`
              }}
              animate={{
                y: [-8, 8, -8],
                opacity: [0.4, 0.8, 0.4],
                scale: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.4
              }}
            />
          ))}
        </div>
            )}
    </motion.div>
  );
};

export default GamifiedMetric; 