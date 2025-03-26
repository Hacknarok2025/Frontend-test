import { useState } from "react";
import { postForResult } from "./api/post";

function App() {
  const [result, setResult] = useState<number | null>(null);
  const [number1, setNumber1] = useState<number | null>(null);
  const [number2, setNumber2] = useState<number | null>(null);

  const fetchResult = async () => {
    if (!number1 || !number2) return;

    try {
      const newResult = await postForResult({ number1, number2 });

      console.log(newResult);

      setResult(newResult);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h3>Siemano, masz tu kalkulator</h3>
      <input
        type="number"
        onChange={(e) => setNumber1(parseFloat(e.currentTarget.value))}
        value={number1 || ""}
      />
      {" + "}
      <input
        type="number"
        onChange={(e) => setNumber2(parseFloat(e.currentTarget.value))}
        value={number2 || ""}
      />
      {" = "}
      <span>{result}</span>
      <button onClick={fetchResult}>Policz</button>
    </>
  );
}

export default App;
