import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Zap, Activity, Shield, Clock, TrendingUp } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import MetricWidget from '../components/MetricWidget';

const Health = () => {
  const [services, setServices] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ serviceName: '', director: '' });
  const [selectedService, setSelectedService] = useState(null);
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedService) {
      fetchHealthData(selectedService.id);
    }
  }, [selectedService]);

  const fetchData = async () => {
    try {
      const [servicesRes, directorsRes] = await Promise.all([
        axios.get('/api/services'),
        axios.get('/api/directors')
      ]);

      setServices(servicesRes.data);
      setDirectors(directorsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthData = async (serviceId) => {
    try {
      const response = await axios.get(`/api/services/${serviceId}/health`);
      setHealthData(response.data);
    } catch (error) {
      console.error('Error fetching health data:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Health & Operations</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor service health, performance, and operational metrics</p>
      </div>

      {/* Filters */}
      <FilterBar onFilterChange={setFilters} directors={directors} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Services</h2>
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`card cursor-pointer transition-all ${
                  selectedService?.id === service.id
                    ? 'ring-2 ring-primary-500 bg-primary-50'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.director}</p>
                  </div>
                  <span className={`status-badge ${
                    service.status === 'healthy' ? 'status-healthy' :
                    service.status === 'warning' ? 'status-warning' : 'status-critical'
                  }`}>
                    {service.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Response:</span>
                    <span className="ml-1 font-medium">{service.avgResponseTime}ms</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Uptime:</span>
                    <span className="ml-1 font-medium">{service.uptime}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Details */}
        <div className="lg:col-span-2">
          {selectedService && healthData ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Health Metrics - {selectedService.name}
                </h2>
                <p className="text-gray-600">Director: {selectedService.director}</p>
              </div>

              {/* Performance Metrics */}
              <div className="card mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MetricWidget
                    title="Avg Response Time"
                    value={healthData.health.performance.avgResponseTime}
                    unit="ms"
                    color="primary"
                  />
                  <MetricWidget
                    title="P95 Latency"
                    value={healthData.health.performance.p95Latency}
                    unit="ms"
                    color="warning"
                  />
                  <MetricWidget
                    title="P99 Latency"
                    value={healthData.health.performance.p99Latency}
                    unit="ms"
                    color="danger"
                  />
                  <MetricWidget
                    title="Throughput"
                    value={healthData.health.performance.throughput}
                    unit="req/s"
                    color="success"
                  />
                  <MetricWidget
                    title="Concurrent Capacity"
                    value={healthData.health.performance.concurrentCapacity}
                    unit="req"
                    color="primary"
                  />
                  <MetricWidget
                    title="Autoscaling Responsiveness"
                    value={healthData.health.performance.autoscalingResponsiveness}
                    unit="%"
                    color="success"
                  />
                </div>
              </div>

              {/* Reliability Metrics */}
              <div className="card mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Reliability & Availability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MetricWidget
                    title="Uptime (SLA/SLO)"
                    value={healthData.health.reliability.uptime}
                    unit="%"
                    color="success"
                  />
                  <MetricWidget
                    title="MTTR"
                    value={healthData.health.reliability.mttr}
                    unit="min"
                    color="warning"
                  />
                  <MetricWidget
                    title="MTBF"
                    value={healthData.health.reliability.mtbf}
                    unit="hrs"
                    color="primary"
                  />
                  <MetricWidget
                    title="Error Rate"
                    value={healthData.health.reliability.errorRate}
                    unit="%"
                    color="danger"
                  />
                  <MetricWidget
                    title="Success Rate"
                    value={healthData.health.reliability.successRate}
                    unit="%"
                    color="success"
                  />
                </div>
              </div>

              {/* Security & Deployment */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-purple-600" />
                    Security Metrics
                  </h3>
                  <div className="space-y-4">
                    <MetricWidget
                      title="Auth Coverage"
                      value={healthData.health.security.authCoverage}
                      unit="%"
                      color="success"
                    />
                    <MetricWidget
                      title="Security Patch Lead Time"
                      value={healthData.health.security.securityPatchLeadTime}
                      unit="days"
                      color="warning"
                    />
                    <MetricWidget
                      title="Audit Logging Completeness"
                      value={healthData.health.security.auditLoggingCompleteness}
                      unit="%"
                      color="primary"
                    />
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-orange-600" />
                    Deployment Metrics
                  </h3>
                  <div className="space-y-4">
                    <MetricWidget
                      title="Deployment Frequency"
                      value={healthData.health.deployment.deploymentFrequency}
                      unit="per day"
                      color="success"
                    />
                    <MetricWidget
                      title="Change Failure Rate"
                      value={healthData.health.deployment.changeFailureRate}
                      unit="%"
                      color="danger"
                    />
                    <MetricWidget
                      title="Lead Time to Production"
                      value={healthData.health.deployment.leadTimeToProduction}
                      unit="hours"
                      color="warning"
                    />
                    <MetricWidget
                      title="Rollback Time"
                      value={healthData.health.deployment.rollbackTime}
                      unit="min"
                      color="primary"
                    />
                    <MetricWidget
                      title="Build & Test Duration"
                      value={healthData.health.deployment.buildTestDuration}
                      unit="min"
                      color="gray"
                    />
                  </div>
                </div>
              </div>

              {/* Observability */}
              <div className="card mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                  Observability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MetricWidget
                    title="Trace Completeness"
                    value={healthData.health.observability.traceCompleteness}
                    unit="%"
                    color="primary"
                  />
                  <MetricWidget
                    title="Time to Detect"
                    value={healthData.health.observability.timeToDetect}
                    unit="min"
                    color="warning"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Service</h3>
                <p className="text-gray-600">Choose a service from the list to view detailed health metrics</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Health; 