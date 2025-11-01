import "@mantine/core/styles.css";
import { BrowserRouter } from "react-router";
import { MantineProvider } from "@mantine/core";

interface ProviderProps {
  children: React.ReactElement;
}

function Provider({
  children,
}: ProviderProps) {
  return (
    <MantineProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </MantineProvider>
  );
}

export { Provider };
