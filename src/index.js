import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

function ApiPolling() {
  const defaultDelay = 1000;

  const [startedCount, setStartedCount] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);
  const [pokemon, setPokemon] = useState("");
  const [delay, setDelay] = useState(defaultDelay);

  usePolling(async () => {
    setStartedCount((count) => count + 1);
    await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=1&offset=${startedCount}`
    )
      .then((res) => res.json())
      .then((result) => {
        setPokemon(result.results[0].name);
        console.log(`Pokemon ${startedCount} : ${result.results[0].name}`);
      });
    setFinishedCount((count) => count + 1);
  }, delay);

  const onStart = () => {
    setDelay(defaultDelay);
  };

  const onStop = () => {
    setDelay(null);
  };

  return (
    <>
      <h1>Started: {startedCount}</h1>
      <h1>Finished: {finishedCount}</h1>
      <h1>API Response</h1>
      <div className="pokemonCard">
        Pokemon {startedCount} : {pokemon}
      </div>
      <button className="startBtn" disabled={delay == null} onClick={onStop}>
        Stop
      </button>
      <button className="stopBtn" disabled={delay != null} onClick={onStart}>
        Start
      </button>
    </>
  );
}

function usePolling(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let running = false;
    let savedTimeout = null;

    const tick = async () => {
      if (running) {
        await savedCallback.current();
      }

      if (running) {
        savedTimeout = setTimeout(tick, delay);
      }
    };

    const stop = () => {
      running = false;
      const timeout = savedTimeout;

      if (timeout !== null) {
        clearTimeout(timeout);
      }
    };

    if (delay !== null) {
      running = true;
      savedTimeout = setTimeout(tick, delay);
      return stop;
    }
  }, [delay]);
}

const rootElement = document.getElementById("root");
ReactDOM.render(<ApiPolling />, rootElement);
