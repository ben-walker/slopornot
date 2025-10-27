import "@mantine/core/styles.css";
import { useState } from "react";
import { MantineProvider } from "@mantine/core"; // TODO: non-feature App component with providers

function App() {
  const [count, setCount] = useState(0);

  return (
    <MantineProvider>
      <h1>Vite + React</h1>
      <div className="card">
        <button type="button" onClick={() => { setCount(count => count + 1); }}>
          {`count is ${count.toString()}`}
        </button>
      </div>
    </MantineProvider>
  );
}

export { App };
