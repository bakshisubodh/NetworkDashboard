const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Mock data for services
const mockServices = [
  {
    id: 1,
    name: 'User Service',
    director: 'John Smith',
    status: 'healthy',
    coverage: 95,
    badge: 'platinum',
    avgResponseTime: 120,
    p95Latency: 250,
    throughput: 1500,
    uptime: 99.9,
    errorRate: 0.1
  },
  {
    id: 2,
    name: 'Payment Service',
    director: 'Sarah Johnson',
    status: 'warning',
    coverage: 85,
    badge: 'gold',
    avgResponseTime: 180,
    p95Latency: 350,
    throughput: 800,
    uptime: 99.5,
    errorRate: 0.3
  },
  {
    id: 3,
    name: 'Notification Service',
    director: 'Mike Davis',
    status: 'critical',
    coverage: 65,
    badge: 'bronze',
    avgResponseTime: 300,
    p95Latency: 600,
    throughput: 400,
    uptime: 98.2,
    errorRate: 1.2
  },
  {
    id: 4,
    name: 'Analytics Service',
    director: 'Lisa Wang',
    status: 'healthy',
    coverage: 92,
    badge: 'platinum',
    avgResponseTime: 150,
    p95Latency: 280,
    throughput: 1200,
    uptime: 99.8,
    errorRate: 0.2
  },
  {
    id: 5,
    name: 'Auth Service',
    director: 'David Brown',
    status: 'healthy',
    coverage: 88,
    badge: 'gold',
    avgResponseTime: 90,
    p95Latency: 200,
    throughput: 2000,
    uptime: 99.9,
    errorRate: 0.05
  }
];

// Mock quality data
const mockQualityData = {
  unitTesting: {
    coverage: 92,
    passRate: 98.5,
    trend: [95, 93, 91, 94, 92, 93, 95, 92, 91, 94, 92, 93, 95, 92, 91, 94, 92, 93, 95, 92, 91, 94, 92, 93, 95, 92, 91, 94, 92, 93]
  },
  integrationTesting: {
    coverage: 87,
    passRate: 96.2,
    trend: [88, 86, 89, 87, 85, 88, 86, 89, 87, 85, 88, 86, 89, 87, 85, 88, 86, 89, 87, 85, 88, 86, 89, 87, 85, 88, 86, 89, 87, 85]
  },
  componentTesting: {
    coverage: 78,
    passRate: 94.1,
    trend: [80, 77, 79, 76, 78, 80, 77, 79, 76, 78, 80, 77, 79, 76, 78, 80, 77, 79, 76, 78, 80, 77, 79, 76, 78, 80, 77, 79, 76, 78]
  },
  apiIntegrationTesting: {
    coverage: 85,
    passRate: 97.3,
    rollbacks: 2,
    trend: [86, 84, 87, 85, 83, 86, 84, 87, 85, 83, 86, 84, 87, 85, 83, 86, 84, 87, 85, 83, 86, 84, 87, 85, 83, 86, 84, 87, 85, 83]
  },
  userJourneyTesting: {
    coverage: 82,
    passRate: 95.8,
    trend: [83, 81, 84, 82, 80, 83, 81, 84, 82, 80, 83, 81, 84, 82, 80, 83, 81, 84, 82, 80, 83, 81, 84, 82, 80, 83, 81, 84, 82, 80]
  },
  // New quality metrics
  defectSlippageRatio: {
    value: 2.3,
    trend: [2.1, 2.5, 2.0, 2.8, 2.2, 2.4, 2.1, 2.6, 2.3, 2.0, 2.7, 2.2, 2.5, 2.1, 2.9, 2.3, 2.0, 2.4, 2.2, 2.6, 2.1, 2.8, 2.3, 2.0, 2.5, 2.2, 2.7, 2.1, 2.4, 2.3]
  },
  defectsSlippedToProduction: {
    value: 5,
    trend: [4, 6, 3, 7, 5, 4, 6, 3, 5, 4, 7, 5, 4, 6, 3, 5, 4, 6, 5, 3, 7, 4, 5, 6, 3, 5, 4, 6, 5, 5]
  },
  productionIncidents: {
    value: 2,
    trend: [1, 3, 2, 1, 4, 2, 1, 3, 2, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 2, 2]
  }
};

// Mock health and ops data
const mockHealthData = {
  performance: {
    avgResponseTime: 150,
    p95Latency: 300,
    p99Latency: 500,
    throughput: 1200,
    concurrentCapacity: 500,
    autoscalingResponsiveness: 95
  },
  reliability: {
    uptime: 99.8,
    mttr: 15,
    mtbf: 720,
    errorRate: 0.2,
    successRate: 99.8
  },
  security: {
    authCoverage: 98,
    securityPatchLeadTime: 2,
    auditLoggingCompleteness: 95
  },
  deployment: {
    deploymentFrequency: 12,
    changeFailureRate: 2.5,
    leadTimeToProduction: 4,
    rollbackTime: 8,
    buildTestDuration: 15
  },
  observability: {
    traceCompleteness: 92,
    timeToDetect: 3
  }
};

// API Routes
app.get('/api/services', (req, res) => {
  const { serviceName, director } = req.query;
  let filteredServices = mockServices;

  if (serviceName) {
    filteredServices = filteredServices.filter(service =>
      service.name.toLowerCase().includes(serviceName.toLowerCase())
    );
  }

  if (director) {
    filteredServices = filteredServices.filter(service =>
      service.director.toLowerCase().includes(director.toLowerCase())
    );
  }

  res.json(filteredServices);
});

app.get('/api/services/:id', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const service = mockServices.find(s => s.id === serviceId);
  
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json(service);
});

app.get('/api/services/:id/quality', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const service = mockServices.find(s => s.id === serviceId);
  
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json({
    service,
    quality: mockQualityData
  });
});

app.get('/api/services/:id/health', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const service = mockServices.find(s => s.id === serviceId);
  
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json({
    service,
    health: mockHealthData
  });
});

app.get('/api/services/:id/release-readiness', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const service = mockServices.find(s => s.id === serviceId);
  
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json({
    service,
    releaseReadiness: {
      qualityGates: {
        unitTestCoverage: service.coverage >= 90,
        integrationTestCoverage: service.coverage >= 85,
        apiTestCoverage: service.coverage >= 80,
        securityScan: true,
        performanceTest: service.avgResponseTime < 200
      },
      deploymentMetrics: {
        lastDeployment: '2024-01-15T10:30:00Z',
        deploymentFrequency: '2x per day',
        rollbackRate: '2%',
        changeFailureRate: '1.5%'
      },
      readinessScore: 92
    }
  });
});

app.get('/api/directors', (req, res) => {
  const directors = [...new Set(mockServices.map(service => service.director))];
  res.json(directors);
});

app.get('/api/overview', (req, res) => {
  const topServices = mockServices
    .sort((a, b) => b.coverage - a.coverage)
    .slice(0, 10);

  res.json({
    topServices,
    summary: {
      totalServices: mockServices.length,
      healthyServices: mockServices.filter(s => s.status === 'healthy').length,
      averageCoverage: mockServices.reduce((sum, s) => sum + s.coverage, 0) / mockServices.length,
      averageUptime: mockServices.reduce((sum, s) => sum + s.uptime, 0) / mockServices.length
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 