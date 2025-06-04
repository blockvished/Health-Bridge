name: Build & Deploy Node.js App to VPS
on:
  push:
    branches: [ "main" ]          # deploy only when main is updated
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production            # triggers GitHub’s built-in manual approval
    # 1️⃣ ──────────────────────────────────────────────────────────────────────
    # Add every secret you need for build/run below.
    # These are masked in the logs by GitHub.
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      # NEXT_PUBLIC_API_BASE: ${{ secrets.NEXT_PUBLIC_API_BASE }}   # example public var
    # 2️⃣ ──────────────────────────────────────────────────────────────────────
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host:     ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          port:     ${{ secrets.VPS_PORT }}
          key:      ${{ secrets.VPS_SSH_KEY }}
          # Forward the secret names to the remote shell (comma-separated list)
          envs: DATABASE_URL
          script: |
            # ── Load Node.js 22 via nvm (non-interactive shell) ───────────
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
            nvm use 22
            # ── Go to the app directory & get latest code ────────────────
            cd /home/LiveDoctors-app/LD2025
            git fetch --all
            git reset --hard origin/main     # force-sync to repo state
            # ── Install deps & build with secrets in env ─────────────────
            NODE_ENV=production npm ci
            NODE_ENV=production DATABASE_URL="$DATABASE_URL" npm run build
            # ── Start or restart with PM2, injecting updated env vars ────
            if pm2 describe livedoctors > /dev/null 2>&1; then
              DATABASE_URL="$DATABASE_URL" pm2 restart livedoctors --update-env
            else
              DATABASE_URL="$DATABASE_URL" pm2 start npm --name "livedoctors" -- start
            fi
            # (optional) save process list so it auto-starts on reboot
            pm2 save