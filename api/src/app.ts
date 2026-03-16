import Fastify from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import cors from "@fastify/cors";
import { db } from "./plugins/db";
import helmet from "@fastify/helmet";
import { openapi } from "./modules/openapi/routes";
import sensible from "@fastify/sensible";
import { sets } from "./modules/sets/routes";
import swagger from "@fastify/swagger";

const buildApp = () => {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.register(swagger, {
    openapi: {
      info: { title: "slopornot", version: "1.0.0" },
    },
  });
  app.register(cors);
  app.register(helmet);
  app.register(sensible);
  app.register(db);

  // App routes
  app.register(sets, { prefix: "/sets" });
  app.register(openapi, { prefix: "/openapi" });

  return app;
};

export { buildApp };
