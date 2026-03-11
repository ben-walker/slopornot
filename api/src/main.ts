import { buildApp } from "./app";
import closeWithGrace from "close-with-grace";
import { config } from "./config";

const app = buildApp();

closeWithGrace(async ({ err, signal }) => {
  if (err) {
    app.log.error({ err }, "Server closing with error");
  }
  else if (signal) {
    app.log.info(`${signal} received, server closing`);
  }
  else {
    app.log.info("Server closing due to timeout");
  }

  await app.close();
});

try {
  await app.listen({ host: config.HOST, port: config.PORT });
}
catch (err) {
  app.log.error({ err }, "Server failed to start");
  process.exit(1);
}
