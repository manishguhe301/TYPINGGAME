import { useRef, useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const alphabets = "abcdefghijklmnopqrstuvwxyz";
  const [RandomChar, setRandomChar] = useState("");
  const [Seconds, setSeconds] = useState(0);
  const [MiliSeconds, setMiliSeconds] = useState(0);
  const [Counter, setCounter] = useState(0);
  const timeRef = useRef(null);

  useEffect(() => {
    timeRef.current = setInterval(() => {
      setMiliSeconds(MiliSeconds + 1);
      if (MiliSeconds === 99) {
        setSeconds(Seconds + 1);
        setMiliSeconds(0);
      }
    }, 10);

    return () => clearInterval(timeRef.current);
  });

  useEffect(() => {
    generateRandomCharacter();
  }, []);

  const generateRandomCharacter = () => {
    setRandomChar(alphabets[Math.floor(Math.random() * alphabets.length)]);
  };

  const handleChange = useCallback(
    (event) => {
      if (event.key === RandomChar) {
        setCounter(Counter + 1);
        generateRandomCharacter();
      } else {
        if (MiliSeconds > 50) {
          setMiliSeconds(MiliSeconds % 100);
          setSeconds(Seconds + 1);
        } else {
          setMiliSeconds(MiliSeconds + 50);
        }
      }
    },
    [Counter, Seconds, MiliSeconds, RandomChar]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleChange);

    return () => {
      document.removeEventListener("keydown", handleChange);
    };
  }, [handleChange]);

  const stopTime = () => {
    clearInterval(timeRef.current);
    timeRef.current = null;
  };

  useEffect(() => {
    if (Counter > 19) {
      document.removeEventListener("keydown", handleChange);
      stopTime();
      if (!localStorage.getItem("bestScore")) {
        localStorage.setItem("bestScore", Seconds * 100 + MiliSeconds);
        setRandomChar("Success!");
      } else if (
        localStorage.getItem("bestScore") >
        Seconds * 100 + MiliSeconds
      ) {
        localStorage.setItem("bestScore", Seconds * 100 + MiliSeconds);
        setRandomChar("SUCCESS!");
      } else if (
        localStorage.getItem("bestScore") <
        Seconds * 100 + MiliSeconds
      ) {
        setRandomChar("Failure:(");
      }
    }
  }, [Counter, RandomChar, Seconds, MiliSeconds, handleChange]);

  return (
    <div className="App" style={{ marginTop: "30px" }}>
      <p style={{ marginBottom: "5px" }}>Type The Alphabet</p>
      <p>Typing game to see how fast you type. Timer starts when you do :)</p>
      <div className="character_card">
        <p className="character">{RandomChar.toUpperCase()}</p>
      </div>
      <p>Type the alphabet which is shown in above section.</p>
      <p>
        Time: {Seconds}.{MiliSeconds}s
      </p>
      <p>
        My best time : {(localStorage.getItem("bestScore") / 100).toFixed(2)}{" "}
      </p>
    </div>
  );
}

export default App;
