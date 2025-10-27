import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

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
