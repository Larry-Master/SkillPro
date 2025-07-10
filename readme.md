# SkillPro – Learning Platform for Students

**SkillPro** is a full-stack web application built with **Next.js**, designed to help students engage with learning content, manage course enrollment, and interact with professors. It uses **MongoDB** for data storage and supports robust testing and continuous integration workflows.

To start the application using Docker use : docker-compose up --build 

---

## Features

### Core Platform Capabilities

- Students can browse and enroll in courses
- Professors can create and manage courses
- Courses include capacity limits and enrolled student tracking
- Backend validation and database population using Mongoose models

### Testing

- Unit tests for Mongoose models and services
- Middleware tested with Jest and spies
- End-to-end tests of the REST API
- `.bat` scripts for curl-based manual API testing
- Snapshot testing support (optional)
- GitHub Actions integration for automated testing

### Infrastructure

- Docker support with MongoDB running on port `27018`
- GitHub Actions for CI/CD test workflows

---

## Getting Started

### Requirements

- Node.js
- Docker and Docker Compose

---


