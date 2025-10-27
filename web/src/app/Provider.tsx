import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

interface ProviderProps {
  children: React.ReactElement;
}

function Provider({
  children,
}: ProviderProps) {
  return (
    <MantineProvider>
      {children}
    </MantineProvider>
  );
}

export { Provider };
