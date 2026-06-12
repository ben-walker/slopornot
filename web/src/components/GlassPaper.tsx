import { Paper, type PaperProps } from "@mantine/core";
import type { ReactNode } from "react";
import classes from "./GlassPaper.module.css";
import { clsx } from "clsx";

interface GlassPaperProps extends PaperProps {
  children?: ReactNode;
}

function GlassPaper({ className, ...rest }: GlassPaperProps) {
  return (
    <Paper
      {...rest}
      className={clsx(classes.root, className)}
    />
  );
}

export { GlassPaper };
