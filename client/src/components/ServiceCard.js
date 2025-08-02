import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';

const ServiceCard = ({ service }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'status-healthy';
      case 'warning':
        return 'status-warning';
      case 'critical':
        return 'status-critical';
      default:
        return 'status-warning';
    }
  };

  const getCoverageColor = (coverage) => {
    if (coverage >= 90) return 'text-success-600 dark:text-success-400';
    if (coverage >= 80) return 'text-warning-600 dark:text-warning-400';
    if (coverage >= 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-danger-600 dark:text-danger-400';
  };

  return (
    <div className="card hover:shadow-lg transition-shadow cursor-pointer">
      <Link to={`/service/${service.id}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {service.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{service.director}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`status-badge ${getStatusColor(service.status)}`}>
              {service.status === 'healthy' && <TrendingUp className="w-3 h-3 mr-1" />}
              {service.status === 'warning' && <Clock className="w-3 h-3 mr-1" />}
              {service.status === 'critical' && <AlertCircle className="w-3 h-3 mr-1" />}
              {service.status}
            </span>
            <span className={`badge-${service.badge} px-2 py-1 rounded-full text-xs font-medium`}>
              {service.badge}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Coverage</span>
              <span className={`text-lg font-semibold ${getCoverageColor(service.coverage)}`}>
                {service.coverage}%
              </span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {service.avgResponseTime}ms
              </span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {service.uptime}%
              </span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {service.errorRate}%
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ServiceCard; 