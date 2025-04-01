import { useState } from "react";
import { postForResult } from "./api/post";
import { Button } from "./components/ui/button";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  const [result, setResult] = useState<number | null>(null);
  const [number1, setNumber1] = useState<number | null>(null);
  const [number2, setNumber2] = useState<number | null>(null);

  const fetchResult = async () => {
    if (!number1 || !number2) return;

    try {
      const newResult = await postForResult({ number1, number2 });

      console.log(newResult);

      setResult(newResult.result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
