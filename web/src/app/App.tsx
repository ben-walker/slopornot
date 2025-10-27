import { Button, Container, Title } from "@mantine/core";
import { Provider } from "./Provider";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count => count + 1);
  };

  return (
    <Provider>
      <Container>
        <Title order={3}>slopornot</Title>
        <Button onClick={handleClick}>
          {`count is ${count.toString()}`}
        </Button>
      </Container>
    </Provider>
  );
}

export { App };
