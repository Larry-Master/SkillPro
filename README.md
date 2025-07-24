# SkillPro – Learning Platform for Students

[![Build Status](https://github.com/larry-master/skillpro/actions/workflows/test.yml/badge.svg)](https://github.com/larry-master/skillpro/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/larry-master/SkillPro/badge.svg?branch=main)](https://coveralls.io/github/larry-master/SkillPro?branch=main)

**SkillPro** is a full-stack web application built with **Next.js** and **React**, designed to support student learning, course enrollment, and professor interaction. It uses **MongoDB Atlas** for cloud data storage and deploys via **Vercel** with CI/CD via **GitHub Actions**.

**Live Application:** [https://skill-pro-tau.vercel.app](https://skill-pro-tau.vercel.app)

---

## Features

### Core Capabilities ⚙️
- Students can browse and enroll in courses
- Professors can create and manage courses
- Capacity limits and enrollment tracking per course
- Backend data validation with **Mongoose**

### Testing & CI 🔍
- Unit tests for models and services
- Middleware tests using **Jest**
- End-to-end API tests
- Snapshot testing support
- Manual API testing scripts
- GitHub Actions for automated CI/CD

### Infrastructure 🏗️
- MongoDB Atlas cloud database
- Vercel automatic deployments
- Optional Docker support for local development

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- Docker (optional)
- GitHub account (for deployment)

### Clone the Repository

```bash
$ git clone https://github.com/Larry-Master/SkillPro.git
$ cd skillpro
