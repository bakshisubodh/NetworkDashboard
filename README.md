# Network Services Dashboard

A comprehensive web application for monitoring and analyzing backend services quality, health, and release readiness. Built with React, Express, and Tailwind CSS.

## Features

### 🎯 Overview Dashboard
- Top 10 services overview with key metrics
- Summary statistics across all services
- Quick status indicators and performance metrics
- Service filtering and search capabilities

### 🛡️ Quality Metrics
- **Pre-release Quality**: Unit testing, Integration testing, Component testing
- **Post-deployment Quality**: API Integration testing, User Journey testing
- Coverage percentages and test pass rates
- 30-day trend data visualization
- Quality badges (Platinum, Gold, Silver, Bronze) with color coding

### ⚡ Health & Operations
- **Performance Metrics**: Response time, latency, throughput, capacity
- **Reliability**: Uptime, MTTR, MTBF, error rates
- **Security**: Auth coverage, patch lead time, audit logging
- **Deployment**: Frequency, failure rates, lead time, rollback metrics
- **Observability**: Trace completeness, time to detect

### 🚀 Release Readiness
- Quality gates assessment
- Deployment metrics and frequency
- Release checklist and approval status
- Overall readiness scoring

## Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Lucide React** - Icon library
- **React Router** - Client-side routing

### Backend
- **Express.js** - Node.js web framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

## Project Structure

```
NetworkDashboard/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Express backend
│   ├── index.js           # Main server file
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NetworkDashboard
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000).

### Alternative Manual Setup

If you prefer to install dependencies separately:

1. **Install root dependencies**
   ```bash
   npm install
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start the servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm start
   ```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install dependencies for all packages

### Backend (server/)
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

### Frontend (client/)
- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm test` - Run tests

## API Endpoints

### Services
- `GET /api/services` - Get all services (with optional filtering)
- `GET /api/services/:id` - Get specific service details
- `GET /api/services/:id/quality` - Get quality metrics for a service
- `GET /api/services/:id/health` - Get health metrics for a service
- `GET /api/services/:id/release-readiness` - Get release readiness data

### General
- `GET /api/directors` - Get list of all directors
- `GET /api/overview` - Get overview statistics

## Features in Detail

### Quality Metrics
- **Unit Testing**: Code coverage and pass rates
- **Integration Testing**: API integration coverage
- **Component Testing**: UI component testing metrics
- **API Integration Testing**: Post-deployment API testing with rollback tracking
- **User Journey Testing**: End-to-end testing coverage

### Health & Operations
- **Performance**: Response times, latency percentiles, throughput
- **Reliability**: Uptime, mean time metrics, error rates
- **Security**: Authentication coverage, security patch management
- **Deployment**: CI/CD metrics, failure rates, lead times
- **Observability**: Monitoring and alerting effectiveness

### Release Readiness
- **Quality Gates**: Automated checks and validations
- **Deployment Metrics**: Frequency, success rates, rollback statistics
- **Release Checklist**: Manual verification items
- **Readiness Scoring**: Overall assessment algorithm

## Customization

### Adding New Services
Edit the mock data in `server/index.js` to add new services with their metrics.

### Modifying Metrics
Update the metric calculations and thresholds in the respective page components.

### Styling
The application uses Tailwind CSS. Modify `client/tailwind.config.js` for theme customization.

## Deployment

### Production Build
1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Start the production server:
   ```bash
   cd server
   npm start
   ```

### Environment Variables
Create a `.env` file in the server directory:
```
PORT=5000
NODE_ENV=production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue in the repository. 