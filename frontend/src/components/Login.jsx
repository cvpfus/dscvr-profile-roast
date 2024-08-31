import { useState } from "react";
import axios from "axios";
import { SIMPLE_SERVER_API_URL } from "../constants/index.js";

const Login = ({ setIsLoggedIn }) => {
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await axios.post(SIMPLE_SERVER_API_URL, {
      password,
    });

    if (response.data.status) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div>
      <form>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default Login;
