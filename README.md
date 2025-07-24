# SkillPro – Learning Platform for Students

[![Build Status](https://github.com/larry-master/skillpro/actions/workflows/test.yml/badge.svg)](https://github.com/larry-master/skillpro/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/Larry-Master/SkillPro/badge.svg?branch=main)](https://coveralls.io/github/Larry-Master/SkillPro?branch=main)

**SkillPro** is a full-stack web application built with **Next.js** and **React**, designed to support student learning, course enrollment, and professor interaction. It uses **MongoDB Atlas** for cloud data storage and deploys via **Vercel** with CI/CD via **GitHub Actions**.

**Live Application:** [https://skill-pro-tau.vercel.app](https://skill-pro-tau.vercel.app)

---

## Features

### Core Capabilities ⚙️
- Students can browse and enroll in courses
- Professors can create and manage courses
- Mentors can provide one-on-one sessions
- Reviews and ratings system
- Assignment submission and assessment
- Capacity limits and enrollment tracking per course
- Certificate generation for completed courses

### Testing & Quality Assurance 🔍
- Unit tests for models and services
- Integration tests for API endpoints
- End-to-end API testing
- Jest snapshot testing
- Automated test scripts
- GitHub Actions for CI/CD

### Technical Stack 🛠️
- **Frontend**: Next.js, React
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Jest, Supertest
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel
- **Container**: Docker support

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas URI)
- Git
- npm
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Larry-Master/SkillPro.git
cd skillpro
```

Install dependencies:
```bash
npm install
```

### Running Tests

Run all tests with coverage:
```bash
npm test
```

### Docker Support

Build and run with Docker:
```bash
docker-compose up --build
```

---
## Testing Strategy

### Unit Tests
- Model validation and methods
- Utility functions
- Component rendering

### Integration Tests
- API endpoints with 100% coverage
- Database operations
- Authentication flows

### End-to-End Tests
- User workflows
- Form submissions
- API integrations



