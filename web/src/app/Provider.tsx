import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { MantineProvider } from "@mantine/core";

const queryClient = new QueryClient();

interface ProviderProps {
  children: React.ReactElement;
}

function Provider({
  children,
}: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export { Provider };
