import Login from "./components/Login.jsx";
import { useState } from "react";
import { useCanvasClient } from "./hooks/useCanvaClient.js";
import { useResizeObserver } from "./hooks/useResizeObserver.js";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { client, user, isReady } = useCanvasClient();

  useResizeObserver(client);

  if (!isLoggedIn) return <Login setIsLoggedIn={setIsLoggedIn} />;
  return <div>asdasd</div>;
};

export default App;
