import { Route, Routes } from "react-router";
import { AppRoot } from "./routes/layouts/AppRoot";
import { Game } from "./routes/Game";

function Router() {
  return (
    <Routes>
      <Route element={<AppRoot />}>
        <Route path="/" element={<Game />} />
      </Route>
    </Routes>
  );
}

export { Router };
