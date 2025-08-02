import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ModernMetricCard = ({ 
  title, 
  value, 
  unit = '', 
  trend,
  color = 'primary',
  icon: Icon,
  subtitle = '',
  className = '',
  size = 'medium'
}) => {
  const getColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
        border: 'border-blue-200 dark:border-blue-700',
        text: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-500',
        value: 'text-blue-700 dark:text-blue-300'
      },
      success: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
        border: 'border-green-200 dark:border-green-700',
        text: 'text-green-600 dark:text-green-400',
        iconBg: 'bg-green-500',
        value: 'text-green-700 dark:text-green-300'
      },
      warning: {
        bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20',
        border: 'border-yellow-200 dark:border-yellow-700',
        text: 'text-yellow-600 dark:text-yellow-400',
        iconBg: 'bg-yellow-500',
        value: 'text-yellow-700 dark:text-yellow-300'
      },
      danger: {
        bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
        border: 'border-red-200 dark:border-red-700',
        text: 'text-red-600 dark:text-red-400',
        iconBg: 'bg-red-500',
        value: 'text-red-700 dark:text-red-300'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
        border: 'border-purple-200 dark:border-purple-700',
        text: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-500',
        value: 'text-purple-700 dark:text-purple-300'
      }
    };
    return colors[color] || colors.primary;
  };

  const getSizeClasses = (size) => {
    const sizes = {
      small: {
        container: 'p-4',
        icon: 'w-8 h-8',
        value: 'text-xl',
        title: 'text-sm',
        subtitle: 'text-xs'
      },
      medium: {
        container: 'p-6',
        icon: 'w-10 h-10',
        value: 'text-2xl',
        title: 'text-base',
        subtitle: 'text-sm'
      },
      large: {
        container: 'p-8',
        icon: 'w-12 h-12',
        value: 'text-3xl',
        title: 'text-lg',
        subtitle: 'text-base'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={`relative overflow-hidden rounded-xl border ${colorClasses.border} ${colorClasses.bg} ${sizeClasses.container} ${className} shadow-sm hover:shadow-md transition-all duration-300`}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className={`w-full h-full ${colorClasses.iconBg} rounded-full transform translate-x-8 -translate-y-8`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${colorClasses.iconBg} text-white shadow-sm`}>
            {Icon && <Icon className={`${sizeClasses.icon}`} />}
          </div>
          
          {trend !== undefined && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center space-x-1 bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-sm"
            >
              {getTrendIcon(trend)}
              <span className={`text-xs font-medium ${getTrendColor(trend)}`}>
                {Math.abs(trend).toFixed(1)}%
              </span>
            </motion.div>
          )}
        </div>

        {/* Value */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${colorClasses.value} ${sizeClasses.value} font-bold mb-1`}
        >
          {typeof value === 'number' ? value.toFixed(1) : value}{unit}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-gray-700 dark:text-gray-300 ${sizeClasses.title} font-medium mb-1`}
        >
          {title}
        </motion.div>

        {/* Subtitle */}
        {subtitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`text-gray-500 dark:text-gray-400 ${sizeClasses.subtitle}`}
          >
            {subtitle}
          </motion.div>
        )}
      </div>

      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  );
};

export default ModernMetricCard; 