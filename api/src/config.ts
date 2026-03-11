import { Type } from "typebox";
import { Value } from "typebox/value";

const Config = Type.Object({
  DATABASE_URL: Type.String(),
  HOST: Type.String({ default: "0.0.0.0" }),
  PORT: Type.Number({ default: 3000 }),
});

// Strip undefined so Value.Default can apply schema defaults
const clonedConfig = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value !== undefined),
);
Value.Default(Config, clonedConfig);
Value.Convert(Config, clonedConfig);
Value.Clean(Config, clonedConfig);

const config = Value.Parse(Config, clonedConfig);

export { config };
