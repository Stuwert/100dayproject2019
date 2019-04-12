import React, { Component } from 'react';
import { checkAnswers, getCluesForRound } from '../Utility/parseWords';
import Guesses from './Guesses';
import RoundTracker from './RoundTracker';
import DialPad from './DialPad';

const RoundClue = ({ clue, valid }) => {
  return (
    <li className="clue">
      <p>{clue}</p>
      {
        valid === false
          ? <p className="red">Numbers are not repeated in sequence.</p>
          : null
      }
    </li>
  )
}

const getNextActiveInput = (clueWords) => {
  const nextWord = clueWords.find(({ guess }) => guess === '');
  const indexOfNextWord = clueWords.indexOf(nextWord);
  return [nextWord, indexOfNextWord];
}

class MainGame extends Component {
  constructor() {
    super();

    this.state = {
      indexOfNextWord: 0,
      clueWords: [],
      guessWords: [],
      gameState: {
        currentRound: 1,
        correctGuesses: 0,
        incorrectGuesses: 0,
      }
    }
  }

  componentDidMount() {
    this.setState({
      clueWords: this.getWordsForRound(this.state.gameState.currentRound),
    });
  }

  moveIndex = (clueWords, currentIndex) => {
    console.log(clueWords);
    const [nextWord, indexOfNextWord] = getNextActiveInput(clueWords);
    console.log(nextWord);
    if (nextWord) {
      document.querySelector(`[name="${nextWord.word}"]`).focus();
    }
    return indexOfNextWord;
  }

  getWordsForRound = (round) => {
    const createNewClue = this.createNewClue.bind(this);
    return getCluesForRound(round).map(createNewClue);
  }

  createNewClue = (word) => ({
    word,
    guess: '',
    correct: null
  });

  setGuess = (index) => (value) => {
    const { clueWords, indexOfNextWord } = this.state;
    const setClues = clueWords.map((item, mappingIndex) => {
      if (mappingIndex === index) return {
        ...item,
        guess: value
      }
      return item;
    });
    const nextIndex = this.moveIndex(setClues, indexOfNextWord);
    this.setState({
      clueWords: setClues,
      indexOfNextWord: nextIndex
    });
  };

  makeGuess = () => {
    const {
      guessWords,
      clueWords,
      gameState: {
        currentRound
      }
    } = this.state;

    const checkedClueWords = clueWords
      .map((clue) => clue.guess)
      .map((clueToMatch, index, clues) => {
        return clues.filter((clue) => clue === clueToMatch).length === 1
      })

    if (checkedClueWords.indexOf(false) !== -1) {
      const validatedRoundClues = checkedClueWords.map((item, index) => ({
        ...clueWords[index],
        valid: item
      }));
      this.setState({
        clueWords: validatedRoundClues
      });
      return;
    }
    const nextRound = currentRound + 1;

    this.setState({
      gameState: {
        ...this.gameState,
        currentRound: nextRound
      },
      guessWords: guessWords.concat(checkAnswers(currentRound, clueWords)),
      clueWords: this.getWordsForRound(nextRound)
    });
  }


  render() {
    const {
      clueWords,
      guessWords,
      indexOfNextWord,
      gameState: {
        currentRound
      }
    } = this.state;

    const roundArray = Array.apply(null, { length: currentRound }).map((item, i) => i + 1);

    return (
      <section class="row">
        <RoundTracker
          roundArray={roundArray}
          guessedWords={guessWords}
        />

        <div className="row col-xs-9 col-lg-11">
          <div className="box">
            <section className="clues col-xs-12 col-lg-6">
              <div className="row between-xs guessRow">
                {clueWords.map((clue, index) => {
                  const setGuess = this.setGuess(index);
                  return (
                    <div className="col-xs-4">
                      <div className="box inputBox">
                        <input
                          name={clue.word}
                          className={`guess word-${index + 1} col-xs-6`}
                          setGuess={this.setGuess(index)}
                          type="integer"
                          maxLength="1"
                          onChange={(e) => setGuess(parseInt(e.target.value))}
                          value={clue.guess}
                        />
                        <p>{clue.word}</p>
                      </div>
                    </div>
                  )
                }
                )}
              </div>
              <DialPad
                guessedNumbers={clueWords.map(({ guess }) => guess)}
                setGuess={this.setGuess(indexOfNextWord)}
              />
              <button onClick={this.makeGuess}>Submit Guess</button>
              <div className="locks row">
                <img src="https://img.icons8.com/metro/52/000000/lock.png"></img>
                <img src="https://img.icons8.com/metro/52/000000/lock.png"></img>
                <img src="https://img.icons8.com/metro/52/000000/lock.png"></img>
              </div>
            </section>
          </div>
          <Guesses guessWords={guessWords} />
        </div>
      </section>
    );
  }
}

export default MainGame;
