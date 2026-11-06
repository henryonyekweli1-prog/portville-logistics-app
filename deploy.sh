#!/usr/bin/env bash
# One-command GitHub push. Requires git and GitHub CLI (https://cli.github.com), logged in via `gh auth login`.
set -e
git init -b main 2>/dev/null || true
git add -A && git commit -m "Portville Logistics app" || true
gh repo create portville-logistics --public --source=. --remote=origin --push
USER=$(gh api user -q .login)
echo "Repo:   https://github.com/$USER/portville-logistics"
echo "Deploy: https://vercel.com/new/clone?repository-url=https://github.com/$USER/portville-logistics&env=MONGODB_URI,JWT_SECRET,NEXTAUTH_URL"
