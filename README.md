# ERP Documentation

This repository contains the documentation for our ERP system, built with VitePress and deployed to GitHub Pages.

## Local Development

```bash
# Install dependencies
bun i

# Start local development server
bun run start:dev

# Build for production
bun run build

# Preview the built site locally
bun run start
```

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

## Project Structure

- `/docs` - Contains VitePress documentation source files
- `/docs/.vitepress` - VitePress configuration and generated files
- `.github/workflows/deploy.yml` - GitHub Actions workflow for deployment