import Fastify from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import cors from "@fastify/cors";
import { db } from "./plugins/db";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import { sets } from "./modules/sets/routes";

const buildApp = () => {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.register(cors);
  app.register(helmet);
  app.register(sensible);
  app.register(db);

  // App routes
  app.register(sets, { prefix: "/sets" });

  return app;
};

export { buildApp };
