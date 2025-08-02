import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, TrendingUp, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import MetricWidget from '../components/MetricWidget';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [qualityData, setQualityData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [releaseData, setReleaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchServiceData();
  }, [fetchServiceData]);

  const fetchServiceData = useCallback(async () => {
    try {
      const [serviceRes, qualityRes, healthRes, releaseRes] = await Promise.all([
        axios.get(`/api/services/${id}`),
        axios.get(`/api/services/${id}/quality`),
        axios.get(`/api/services/${id}/health`),
        axios.get(`/api/services/${id}/release-readiness`)
      ]);

      setService(serviceRes.data);
      setQualityData(qualityRes.data);
      setHealthData(healthRes.data);
      setReleaseData(releaseRes.data);
    } catch (error) {
      console.error('Error fetching service data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-success-600';
      case 'warning':
        return 'text-warning-600';
      case 'critical':
        return 'text-danger-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCoverageColor = (coverage) => {
    if (coverage >= 90) return 'text-success-600';
    if (coverage >= 80) return 'text-warning-600';
    if (coverage >= 70) return 'text-orange-600';
    return 'text-danger-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
        <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'quality', label: 'Quality', icon: CheckCircle },
    { id: 'health', label: 'Health & Ops', icon: AlertTriangle },
    { id: 'release', label: 'Release Readiness', icon: Clock }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
            <p className="text-gray-600">Director: {service.director}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`status-badge ${
              service.status === 'healthy' ? 'status-healthy' :
              service.status === 'warning' ? 'status-warning' : 'status-critical'
            }`}>
              {service.status === 'healthy' && <TrendingUp className="w-4 h-4 mr-1" />}
              {service.status === 'warning' && <AlertTriangle className="w-4 h-4 mr-1" />}
              {service.status === 'critical' && <XCircle className="w-4 h-4 mr-1" />}
              {service.status}
            </span>
            <span className={`badge-${service.badge} px-3 py-1 rounded-full text-sm font-medium`}>
              {service.badge.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TabIcon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricWidget
                title="Coverage"
                value={`${service.coverage}%`}
                color="primary"
                subtitle="Test coverage"
              />
              <MetricWidget
                title="Response Time"
                value={`${service.avgResponseTime}ms`}
                color="warning"
                subtitle="Average response time"
              />
              <MetricWidget
                title="Uptime"
                value={`${service.uptime}%`}
                color="success"
                subtitle="Service availability"
              />
              <MetricWidget
                title="Error Rate"
                value={`${service.errorRate}%`}
                color="danger"
                subtitle="Error percentage"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Name:</span>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Director:</span>
                    <span className="font-medium">{service.director}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality Badge:</span>
                    <span className={`font-medium badge-${service.badge} px-2 py-1 rounded text-xs`}>
                      {service.badge.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">P95 Latency:</span>
                    <span className="font-medium">{service.p95Latency}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Throughput:</span>
                    <span className="font-medium">{service.throughput} req/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coverage Level:</span>
                    <span className={`font-medium ${getCoverageColor(service.coverage)}`}>
                      {service.coverage >= 90 ? 'Excellent' :
                       service.coverage >= 80 ? 'Good' :
                       service.coverage >= 70 ? 'Fair' : 'Poor'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && qualityData && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        )}

        {activeTab === 'health' && healthData && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                title="Throughput"
                value={healthData.health.performance.throughput}
                unit="req/s"
                color="success"
              />
              <MetricWidget
                title="Uptime"
                value={healthData.health.reliability.uptime}
                unit="%"
                color="success"
              />
              <MetricWidget
                title="Error Rate"
                value={healthData.health.reliability.errorRate}
                unit="%"
                color="danger"
              />
              <MetricWidget
                title="MTTR"
                value={healthData.health.reliability.mttr}
                unit="min"
                color="warning"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Metrics</h3>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment Metrics</h3>
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
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'release' && releaseData && (
          <div>
            <div className="card mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Readiness Score</h3>
                  <p className="text-gray-600">Comprehensive assessment of deployment readiness</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary-600">
                    {releaseData.releaseReadiness.readinessScore}%
                  </div>
                  <div className="text-sm text-gray-600">Ready for Production</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Gates</h3>
                <div className="space-y-3">
                  {Object.entries(releaseData.releaseReadiness.qualityGates).map(([gate, passed]) => (
                    <div key={gate} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900 capitalize">
                        {gate.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      {passed ? (
                        <CheckCircle className="w-5 h-5 text-success-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-danger-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment Metrics</h3>
                <div className="space-y-4">
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail; 