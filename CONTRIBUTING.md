# Contributing to AKAR

Thank you for your interest in contributing to AKAR (Turkey Fuel Prices Live Dashboard & Analytics Engine)!

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/akar.git
   cd akar
   ```
3. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

## Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```
3. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```
4. Verify code quality:
   ```bash
   # In frontend directory
   npm run lint
   npm run build
   ```

## Code Guidelines

- Keep UI text and documentation in English.
- Avoid introducing hardcoded filesystem paths or sensitive credentials.
- Ensure all React Hooks follow standard rules-of-hooks conventions.
- Maintain responsive, clean, and accessible UI components.

## Submitting Pull Requests

1. Commit your changes with clear, descriptive commit messages.
2. Push your branch to GitHub.
3. Open a Pull Request targeting the `main` branch.
4. Describe your changes clearly in the PR description.
