import { Button, Container, Title } from "@mantine/core";
import { useState } from "react";

function Home() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <Container>
      <Title order={3}>slopornot</Title>
      <Button onClick={handleClick}>
        {`count is ${count.toString()}`}
      </Button>
    </Container>
  );
}

export { Home };
