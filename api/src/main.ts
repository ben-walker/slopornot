import { buildApp } from "./app";

const app = buildApp();

try {
  await app.listen({ port: 3000 }); // TODO: env configured
}
catch (err) {
  app.log.error(err);
  process.exit(1);
}
