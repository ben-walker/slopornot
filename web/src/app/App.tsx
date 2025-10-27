import { Button, Container, Title } from "@mantine/core";
import { useState } from "react";
import { Provider } from "./Provider";

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
