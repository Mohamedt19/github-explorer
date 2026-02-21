# GitHub Explorer

A simple React + TypeScript app that lets you search GitHub users, browse their repositories, filter repos, sort, and load more.

## 📸 Preview

![Preview](./public/preview.png)

## Features
- Search GitHub users (debounced input)
- View user profile (avatar, bio, stats)
- Repo list with:
  - GitHub-like language colors
  - Stars count
  - Updated date
- Sort repos: Recently updated / Most stars
- Filter repos by name/description/language
- Skeleton loading UI

## Tech Stack
- React + TypeScript
- Vite
- GitHub REST API

## Run locally
```bash
npm install
npm run dev