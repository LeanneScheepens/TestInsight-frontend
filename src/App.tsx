import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>TestInsight</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;