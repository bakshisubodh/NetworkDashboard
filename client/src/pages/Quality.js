import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, CheckCircle, AlertTriangle, XCircle, Bug } from 'lucide-react';

import FilterBar from '../components/FilterBar';
import MetricWidget from '../components/MetricWidget';
import InteractiveTimeline from '../components/InteractiveTimeline';

const Quality = () => {
  const [services, setServices] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ serviceName: '', director: '' });
  const [selectedService, setSelectedService] = useState(null);
  const [qualityData, setQualityData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedService) {
      fetchQualityData(selectedService.id);
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

  const fetchQualityData = async (serviceId) => {
    try {
      const response = await axios.get(`/api/services/${serviceId}/quality`);
      setQualityData(response.data);
    } catch (error) {
      console.error('Error fetching quality data:', error);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesName = !filters.serviceName || 
      service.name.toLowerCase().includes(filters.serviceName.toLowerCase());
    const matchesDirector = !filters.director || 
      service.director.toLowerCase().includes(filters.director.toLowerCase());
    return matchesName && matchesDirector;
  });

  const getCoverageColor = (coverage) => {
    if (coverage >= 90) return 'text-success-600';
    if (coverage >= 80) return 'text-warning-600';
    if (coverage >= 70) return 'text-orange-600';
    return 'text-danger-600';
  };

  const getCoverageStatus = (coverage) => {
    if (coverage >= 90) return { icon: CheckCircle, color: 'text-success-600', text: 'Excellent' };
    if (coverage >= 80) return { icon: CheckCircle, color: 'text-warning-600', text: 'Good' };
    if (coverage >= 70) return { icon: AlertTriangle, color: 'text-orange-600', text: 'Fair' };
    return { icon: XCircle, color: 'text-danger-600', text: 'Poor' };
  };

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quality Metrics</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor testing coverage and quality indicators across all services</p>
      </div>

      {/* Filters */}
      <FilterBar onFilterChange={setFilters} directors={directors} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Services</h2>
          <div className="space-y-4">
            {filteredServices.map((service) => {
              const status = getCoverageStatus(service.coverage);
              const StatusIcon = status.icon;
              
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`card cursor-pointer transition-all ${
                    selectedService?.id === service.id
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.director}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      <span className={`text-sm font-medium ${status.color}`}>
                        {service.coverage}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          service.coverage >= 90 ? 'bg-success-500' :
                          service.coverage >= 80 ? 'bg-warning-500' :
                          service.coverage >= 70 ? 'bg-orange-500' : 'bg-danger-500'
                        }`}
                        style={{ width: `${service.coverage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality Details */}
        <div className="lg:col-span-2">
          {selectedService && qualityData ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Quality Metrics - {selectedService.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Director: {selectedService.director}</p>
              </div>

              {/* Pre-release Quality */}
              <div className="card mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary-600" />
                  Pre-release Quality
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricWidget
                    title="Unit Testing"
                    value={`${qualityData.quality.unitTesting.coverage}%`}
                    subtitle={`Pass Rate: ${qualityData.quality.unitTesting.passRate}%`}
                    color="success"
                    showChart={true}
                    chartData={qualityData.quality.unitTesting.trend.map((value, index) => ({
                      day: index + 1,
                      value
                    }))}
                  />
                  <MetricWidget
                    title="Integration Testing"
                    value={`${qualityData.quality.integrationTesting.coverage}%`}
                    subtitle={`Pass Rate: ${qualityData.quality.integrationTesting.passRate}%`}
                    color="warning"
                    showChart={true}
                    chartData={qualityData.quality.integrationTesting.trend.map((value, index) => ({
                      day: index + 1,
                      value
                    }))}
                  />
                  <MetricWidget
                    title="Component Testing"
                    value={`${qualityData.quality.componentTesting.coverage}%`}
                    subtitle={`Pass Rate: ${qualityData.quality.componentTesting.passRate}%`}
                    color="primary"
                    showChart={true}
                    chartData={qualityData.quality.componentTesting.trend.map((value, index) => ({
                      day: index + 1,
                      value
                    }))}
                  />
                </div>
              </div>

              {/* Post-deployment Quality */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-success-600" />
                  Post-deployment Quality
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MetricWidget
                    title="API Integration Testing"
                    value={`${qualityData.quality.apiIntegrationTesting.coverage}%`}
                    subtitle={`Pass Rate: ${qualityData.quality.apiIntegrationTesting.passRate}% | Rollbacks: ${qualityData.quality.apiIntegrationTesting.rollbacks}`}
                    color="warning"
                    showChart={true}
                    chartData={qualityData.quality.apiIntegrationTesting.trend.map((value, index) => ({
                      day: index + 1,
                      value
                    }))}
                  />
                  <MetricWidget
                    title="User Journey Testing"
                    value={`${qualityData.quality.userJourneyTesting.coverage}%`}
                    subtitle={`Pass Rate: ${qualityData.quality.userJourneyTesting.passRate}%`}
                    color="primary"
                    showChart={true}
                    chartData={qualityData.quality.userJourneyTesting.trend.map((value, index) => ({
                      day: index + 1,
                      value
                    }))}
                  />
                </div>
              </div>

              {/* Coverage Badge */}
              <div className="mt-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quality Badge</h3>
                  <div className="flex items-center space-x-4">
                    <span className={`badge-${selectedService.badge} px-4 py-2 rounded-full text-lg font-bold`}>
                      {selectedService.badge.toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Overall Coverage</p>
                      <p className={`text-2xl font-bold ${getCoverageColor(selectedService.coverage)}`}>
                        {selectedService.coverage}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Quality Metrics */}
              <div className="mt-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <Bug className="w-5 h-5 mr-2 text-red-600" />
                    Defect & Incident Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <MetricWidget
                        title="Defect Slippage Ratio"
                        value={`${qualityData.quality.defectSlippageRatio.value}%`}
                        color="danger"
                        showChart={true}
                        chartData={qualityData.quality.defectSlippageRatio.trend.map((value, index) => ({
                          day: index + 1,
                          value
                        }))}
                      />
                    </div>
                    <div className="text-center">
                      <MetricWidget
                        title="Defects Slipped to Production"
                        value={qualityData.quality.defectsSlippedToProduction.value}
                        color="warning"
                        showChart={true}
                        chartData={qualityData.quality.defectsSlippedToProduction.trend.map((value, index) => ({
                          day: index + 1,
                          value
                        }))}
                      />
                    </div>
                    <div className="text-center">
                      <MetricWidget
                        title="Production Incidents"
                        value={qualityData.quality.productionIncidents.value}
                        color="danger"
                        showChart={true}
                        chartData={qualityData.quality.productionIncidents.trend.map((value, index) => ({
                          day: index + 1,
                          value
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Timeline for Quality Trends */}
              <div className="mt-6">
                <InteractiveTimeline
                  data={qualityData.quality.defectSlippageRatio.trend.map((value, index) => ({
                    day: index + 1,
                    value
                  }))}
                  title="Defect Slippage Trend (30 Days)"
                  color="red"
                  height={250}
                />
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Service</h3>
                <p className="text-gray-600">Choose a service from the list to view detailed quality metrics</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quality; 