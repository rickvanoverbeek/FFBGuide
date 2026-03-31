module.exports = {
  apps: [
    {
      name: "ffb-hub",
      script: "node",
      args: "server.js",
      cwd: "/var/www/ffbhub/.next/standalone",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/var/log/pm2/ffbhub-error.log",
      out_file: "/var/log/pm2/ffbhub-out.log",
    },
  ],
};
