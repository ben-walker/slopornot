import { type Plugin, loadEnv } from "vite";

/**
 * Serves APP_* environment variables from .env as /config.js during development,
 * mirroring what entrypoint.sh does at runtime in production.
 */
const runtimeConfig = (): Plugin => {
  return {
    name: "runtime-config",
    configureServer(server) {
      server.middlewares.use("/config.js", (_req, res) => {
        const raw = loadEnv("", process.cwd(), "APP_");
        const config = Object.fromEntries(
          Object.entries(raw).map(([key, value]) => [key.replace(/^APP_/, ""), value]),
        );

        res.setHeader("Content-Type", "application/javascript");
        res.end(`window.__config__ = ${JSON.stringify(config)};`);
      });
    },
  };
};

export { runtimeConfig };
