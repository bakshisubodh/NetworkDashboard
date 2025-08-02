import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, AlertTriangle, Clock, CheckCircle, Activity, Shield, Zap } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import FilterBar from '../components/FilterBar';
import ModernMetricCard from '../components/ModernMetricCard';
import InteractiveTimeline from '../components/InteractiveTimeline';

const Overview = () => {
  const [services, setServices] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ serviceName: '', director: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, directorsRes, overviewRes] = await Promise.all([
        axios.get('/api/services'),
        axios.get('/api/directors'),
        axios.get('/api/overview')
      ]);

      setServices(servicesRes.data);
      setDirectors(directorsRes.data);
      setOverview(overviewRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesName = !filters.serviceName || 
      service.name.toLowerCase().includes(filters.serviceName.toLowerCase());
    const matchesDirector = !filters.director || 
      service.director.toLowerCase().includes(filters.director.toLowerCase());
    return matchesName && matchesDirector;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Network Services Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor the health and performance of all backend services</p>
      </div>

      {/* Summary Metrics */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ModernMetricCard
            title="Total Services"
            value={overview.summary.totalServices}
            color="primary"
            icon={Activity}
            size="medium"
            subtitle="Active services in the network"
          />
          <ModernMetricCard
            title="Healthy Services"
            value={overview.summary.healthyServices}
            color="success"
            icon={CheckCircle}
            size="medium"
            subtitle={`${((overview.summary.healthyServices / overview.summary.totalServices) * 100).toFixed(1)}% of total`}
          />
          <ModernMetricCard
            title="Average Coverage"
            value={overview.summary.averageCoverage}
            unit="%"
            color="warning"
            icon={Shield}
            size="medium"
            subtitle="Test coverage across all services"
          />
          <ModernMetricCard
            title="Average Uptime"
            value={overview.summary.averageUptime}
            unit="%"
            color="success"
            icon={Zap}
            size="medium"
            subtitle="Service availability"
          />
        </div>
      )}

      {/* Filters */}
      <FilterBar onFilterChange={setFilters} directors={directors} />

      {/* Top Services */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.slice(0, 10).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Quick Stats with Gamified Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Service Status</h3>
              <TrendingUp className="w-5 h-5 text-success-600" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <ModernMetricCard
                title="Healthy"
                value={services.filter(s => s.status === 'healthy').length}
                color="success"
                icon={CheckCircle}
                size="small"
                subtitle={`${((services.filter(s => s.status === 'healthy').length / services.length) * 100).toFixed(1)}% of total`}
              />
              <ModernMetricCard
                title="Warning"
                value={services.filter(s => s.status === 'warning').length}
                color="warning"
                icon={AlertTriangle}
                size="small"
                subtitle={`${((services.filter(s => s.status === 'warning').length / services.length) * 100).toFixed(1)}% of total`}
              />
              <ModernMetricCard
                title="Critical"
                value={services.filter(s => s.status === 'critical').length}
                color="danger"
                icon={AlertTriangle}
                size="small"
                subtitle={`${((services.filter(s => s.status === 'critical').length / services.length) * 100).toFixed(1)}% of total`}
              />
            </div>
          </div>

                  <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Coverage Levels</h3>
              <Shield className="w-5 h-5 text-primary-600" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ModernMetricCard
                title="Platinum"
                value={services.filter(s => s.coverage >= 90).length}
                color="purple"
                icon={Shield}
                size="small"
                subtitle={`${((services.filter(s => s.coverage >= 90).length / services.length) * 100).toFixed(1)}% of total`}
              />
              <ModernMetricCard
                title="Gold"
                value={services.filter(s => s.coverage >= 80 && s.coverage < 90).length}
                color="warning"
                icon={Shield}
                size="small"
                subtitle={`${((services.filter(s => s.coverage >= 80 && s.coverage < 90).length / services.length) * 100).toFixed(1)}% of total`}
              />
              <ModernMetricCard
                title="Silver"
                value={services.filter(s => s.coverage >= 70 && s.coverage < 80).length}
                color="primary"
                icon={Shield}
                size="small"
                subtitle={`${((services.filter(s => s.coverage >= 70 && s.coverage < 80).length / services.length) * 100).toFixed(1)}% of total`}
              />
              <ModernMetricCard
                title="Bronze"
                value={services.filter(s => s.coverage < 70).length}
                color="danger"
                icon={Shield}
                size="small"
                subtitle={`${((services.filter(s => s.coverage < 70).length / services.length) * 100).toFixed(1)}% of total`}
              />
            </div>
          </div>

                  <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Performance</h3>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-4">
              <ModernMetricCard
                title="Avg Response"
                value={Math.round(services.reduce((sum, s) => sum + s.avgResponseTime, 0) / services.length)}
                unit="ms"
                color="primary"
                icon={Clock}
                size="small"
                subtitle="Average response time across all services"
              />
              <ModernMetricCard
                title="Avg Uptime"
                value={services.reduce((sum, s) => sum + s.uptime, 0) / services.length}
                unit="%"
                color="success"
                icon={Zap}
                size="small"
                subtitle="Average uptime across all services"
              />
            </div>
          </div>
      </div>

      {/* Interactive Timeline */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">30-Day Coverage Trend</h3>
        <InteractiveTimeline
          data={services.length > 0 ? services[0].coverage ? 
            Array.from({ length: 30 }, (_, i) => ({
              day: i + 1,
              value: Math.round(85 + Math.random() * 10)
            })) : [] : []
          }
          title="Overall Coverage Trend"
          color="blue"
          height={250}
        />
      </div>
    </div>
  );
};

export default Overview; 