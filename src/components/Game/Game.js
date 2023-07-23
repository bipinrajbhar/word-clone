import React from "react";

import { range, sample } from "../../utils";
import { NUM_OF_GUESSES_ALLOWED } from "../../constants";
import { checkGuess } from "../../game-helpers";
import { WORDS } from "../../data";

// Pick a random word on every pageload.
const answer = sample(WORDS);
// To make debugging easier, we'll log the solution in the console.
console.info({ answer });

function GuessForm({ onSubmit }) {
  const [value, setValue] = React.useState("");

  const handleChange = (e) => {
    setValue(e.target.value.toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(value);

    setValue("");
  };

  return (
    <form className="guess-input-wrapper" onSubmit={handleSubmit}>
      <label htmlFor="guess-input">Enter guess:</label>
      <input
        id="guess-input"
        type="text"
        value={value}
        onChange={handleChange}
      />
    </form>
  );
}

const Guess = ({ guess = "" }) => {
  const guessResult = checkGuess(answer, guess);

  return (
    <p className="guess">
      {range(0, 5).map((index) => {
        const char = guess?.charAt(index);

        return (
          <span
            key={index}
            className={`cell ${char ? guessResult[index].status : ""}`}
          >
            {char}
          </span>
        );
      })}
    </p>
  );
};

function Game() {
  const [guesses, setGuesses] = React.useState([]);
  const [guessResults, setGuessResults] = React.useState([]);
  const [isWon, setIsWon] = React.useState(false);
  const isLost = !isWon && guessResults?.length >= NUM_OF_GUESSES_ALLOWED;

  const handleSubmitGuessForm = (guess) => {
    if (isWon || isLost) {
      return;
    }
    setGuesses([...guesses, guess]);

    const guessResult = checkGuess(answer, guess);
    setGuessResults([...guessResults, guessResult]);

    setIsWon(guessResult?.every((entry) => entry.status === "correct"));
  };

  return (
    <>
      <div className="guess-result">
        {range(0, NUM_OF_GUESSES_ALLOWED)?.map((index) => (
          <Guess key={index} guess={guesses?.[index]} />
        ))}
      </div>
      {isWon && (
        <div className="happy banner">
          <p>
            <strong>Congratulations!</strong> Got it in
            <strong>{guesses?.length} guesses</strong>.
          </p>
        </div>
      )}
      {isLost && (
        <div className="sad banner">
          <p>
            Sorry, the correct answer is <strong>LEARN</strong>.
          </p>
        </div>
      )}
      <GuessForm onSubmit={handleSubmitGuessForm} />
    </>
  );
}

export default Game;
