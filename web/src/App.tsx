import "@mantine/core/styles.css";
import { useState } from "react";
import { MantineProvider, Button, Title } from "@mantine/core"; // TODO: non-feature App component with providers

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count => count + 1);
  };

  return (
    <MantineProvider>
      <Title order={3}>Vite + React</Title>
      <Button onClick={handleClick}>
        {`count is ${count.toString()}`}
      </Button>
    </MantineProvider>
  );
}

export { App };
