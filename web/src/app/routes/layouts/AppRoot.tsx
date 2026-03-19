import { AppShell, Flex, Title } from "@mantine/core";
import { Outlet } from "react-router";

function AppRoot() {
  return (
    <AppShell
      header={{
        height: 60,
      }}
    >
      <AppShell.Header withBorder={false}>
        <Flex align="center" h="100%" ml="xl">
          <Title order={3}>slopornot</Title>
        </Flex>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export { AppRoot };
