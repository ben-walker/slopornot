import Fastify from "fastify";
import helmet from "@fastify/helmet";

const buildApp = () => {
  const app = Fastify({
    logger: true,
  });

  app.register(helmet);

  return app;
};

export { buildApp };
