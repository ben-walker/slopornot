import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import { DEFAULT_THEME, MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";

const theme = createTheme({
  colors: {
    correct: DEFAULT_THEME.colors.blue,
    incorrect: DEFAULT_THEME.colors.gray,
  },
});

const queryClient = new QueryClient();

interface ProviderProps {
  children: React.ReactElement;
}

function Provider({
  children,
}: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export { Provider };
