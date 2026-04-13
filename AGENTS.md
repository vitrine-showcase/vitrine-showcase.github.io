# AGENTS.md

This repository is the **single source of truth** for the website.

## What to edit

- Make all site changes in `vitrine-showcase.github.io/`
- Do **not** treat `vitrine-maquette/` as the deploy source anymore
- Static assets and data live in `public/`
- Application code lives in `src/`

## Deployment

- Deployment is **GitHub Pages only**
- Pushing to `main` triggers `.github/workflows/deploy.yml`
- The workflow builds the site and deploys it to GitHub Pages
- There is **no AWS deployment path** in this repo

## AWS safety rule

- Do **not** add or restore any AWS deployment workflow
- Do **not** add `aws-actions/configure-aws-credentials`
- Do **not** add S3, CloudFront, or AWS secrets for deployment
- If old docs mention AWS, treat that as historical context only

## Verification

- Local dev: `yarn start`
- Production build: `yarn build`
- CI deploy target: GitHub Pages
