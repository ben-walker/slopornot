import { AppShell, Title } from "@mantine/core";
import { AwardsButton } from "src/features/awards/components/AwardsButton";
import { Outlet } from "react-router";
import classes from "./AppRoot.module.css";

function AppRoot() {
  return (
    <AppShell
      header={{
        height: 60,
      }}
    >
      <AppShell.Header className={classes.header} withBorder={false}>
        <span />
        <Title order={3}>slopornot</Title>
        <div className={classes.actions}>
          <AwardsButton />
        </div>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export { AppRoot };
