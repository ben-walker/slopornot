import { type Static, Type } from "typebox";
import { Value } from "typebox/value";

const Config = Type.Object({
  API_URL: Type.String(),
});

declare global {
  interface Window {
    __config__: Static<typeof Config>;
  }
}

const clonedConfig = structuredClone(window.__config__);
Value.Default(Config, clonedConfig);
Value.Convert(Config, clonedConfig);

const config = Value.Parse(Config, clonedConfig);

export { config };
