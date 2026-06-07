import { Paper, type PaperProps } from "@mantine/core";
import type { ReactNode } from "react";
import classes from "./GlassPaper.module.css";

interface GlassPaperProps extends PaperProps {
  children?: ReactNode;
}

function GlassPaper({ ...rest }: GlassPaperProps) {
  return (
    <Paper
      {...rest}
      className={classes.root}
    />
  );
}

export { GlassPaper };
