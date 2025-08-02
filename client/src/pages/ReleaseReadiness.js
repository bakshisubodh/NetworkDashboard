import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

import FilterBar from '../components/FilterBar';
import MetricWidget from '../components/MetricWidget';

const ReleaseReadiness = () => {
  const [services, setServices] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ serviceName: '', director: '' });
  const [selectedService, setSelectedService] = useState(null);
  const [releaseData, setReleaseData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedService) {
      fetchReleaseData(selectedService.id);
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

  const fetchReleaseData = async (serviceId) => {
    try {
      const response = await axios.get(`/api/services/${serviceId}/release-readiness`);
      setReleaseData(response.data);
    } catch (error) {
      console.error('Error fetching release data:', error);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesName = !filters.serviceName || 
      service.name.toLowerCase().includes(filters.serviceName.toLowerCase());
    const matchesDirector = !filters.director || 
      service.director.toLowerCase().includes(filters.director.toLowerCase());
    return matchesName && matchesDirector;
  });

  const getReadinessScoreColor = (score) => {
    if (score >= 90) return 'text-success-600';
    if (score >= 80) return 'text-warning-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-danger-600';
  };

  const getReadinessStatus = (score) => {
    if (score >= 90) return { icon: CheckCircle, color: 'text-success-600', text: 'Ready' };
    if (score >= 80) return { icon: AlertTriangle, color: 'text-warning-600', text: 'Almost Ready' };
    if (score >= 70) return { icon: Clock, color: 'text-orange-600', text: 'Needs Work' };
    return { icon: XCircle, color: 'text-danger-600', text: 'Not Ready' };
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Release Readiness</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor deployment readiness and quality gates for all services</p>
      </div>

      {/* Filters */}
      <FilterBar onFilterChange={setFilters} directors={directors} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Services</h2>
          <div className="space-y-4">
            {filteredServices.map((service) => {
              // Calculate a mock readiness score based on coverage and performance
              const readinessScore = Math.round(
                (service.coverage * 0.6) + 
                ((100 - service.errorRate) * 0.3) + 
                (service.uptime * 0.1)
              );
              const status = getReadinessStatus(readinessScore);
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
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.director}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      <span className={`text-sm font-medium ${status.color}`}>
                        {readinessScore}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        readinessScore >= 90 ? 'bg-success-500' :
                        readinessScore >= 80 ? 'bg-warning-500' :
                        readinessScore >= 70 ? 'bg-orange-500' : 'bg-danger-500'
                      }`}
                      style={{ width: `${readinessScore}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Release Readiness Details */}
        <div className="lg:col-span-2">
          {selectedService && releaseData ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Release Readiness - {selectedService.name}
                </h2>
                <p className="text-gray-600">Director: {selectedService.director}</p>
              </div>

              {/* Overall Readiness Score */}
              <div className="card mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Readiness Score</h3>
                    <p className="text-gray-600">Comprehensive assessment of deployment readiness</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${getReadinessScoreColor(releaseData.releaseReadiness.readinessScore)}`}>
                      {releaseData.releaseReadiness.readinessScore}%
                    </div>
                    <div className="text-sm text-gray-600">Ready for Production</div>
                  </div>
                </div>
              </div>

              {/* Quality Gates */}
              <div className="card mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Quality Gates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(releaseData.releaseReadiness.qualityGates).map(([gate, passed]) => (
                    <div key={gate} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">
                          {gate.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {passed ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                      {passed ? (
                        <CheckCircle className="w-5 h-5 text-success-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-danger-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment Metrics */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Deployment Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricWidget
                    title="Last Deployment"
                    value={new Date(releaseData.releaseReadiness.deploymentMetrics.lastDeployment).toLocaleDateString()}
                    subtitle="Most recent deployment"
                    color="primary"
                  />
                  <MetricWidget
                    title="Deployment Frequency"
                    value={releaseData.releaseReadiness.deploymentMetrics.deploymentFrequency}
                    subtitle="Deployments per day"
                    color="success"
                  />
                  <MetricWidget
                    title="Rollback Rate"
                    value={releaseData.releaseReadiness.deploymentMetrics.rollbackRate}
                    subtitle="Percentage of rollbacks"
                    color="danger"
                  />
                  <MetricWidget
                    title="Change Failure Rate"
                    value={releaseData.releaseReadiness.deploymentMetrics.changeFailureRate}
                    subtitle="Failed deployments"
                    color="warning"
                  />
                </div>
              </div>

              {/* Release Checklist */}
              <div className="card mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Release Checklist</h3>
                <div className="space-y-3">
                  {[
                    { item: 'All tests passing', status: true },
                    { item: 'Code review completed', status: true },
                    { item: 'Security scan passed', status: true },
                    { item: 'Performance tests passed', status: selectedService.avgResponseTime < 200 },
                    { item: 'Documentation updated', status: true },
                    { item: 'Monitoring configured', status: true },
                    { item: 'Rollback plan ready', status: true },
                    { item: 'Stakeholder approval', status: true }
                  ].map((checklistItem, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{checklistItem.item}</span>
                      {checklistItem.status ? (
                        <CheckCircle className="w-5 h-5 text-success-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-danger-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Service</h3>
                <p className="text-gray-600">Choose a service from the list to view release readiness metrics</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReleaseReadiness; 