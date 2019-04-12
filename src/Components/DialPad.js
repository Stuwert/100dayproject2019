import React from 'react';

const DialButton = ({ number, pressed, setGuess }) => (
  <button
    className={pressed ? "pressed" : ""}
    onClick={() => setGuess(number)}
  >
    {number}
  </button>
)

const DialPad = ({ guessedNumbers, setGuess }) => {
  const dialArray = [
    [1, 4],
    [2, 5],
    [3, 6],
  ]

  return (
    <div className="row dialPad">
      {
        dialArray.map((dialRow) => (
          <div className="col-xs-12">
            {dialRow.map(number => (
              <DialButton
                pressed={guessedNumbers.includes(number)}
                setGuess={setGuess}
                number={number}
              />
            ))}
          </div>
        )
        )
      }
    </div>
  )
}

export default DialPad;
