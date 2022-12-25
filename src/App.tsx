import React, { createRef, Fragment, RefObject, useEffect, useState } from 'react';
import { workerData } from 'worker_threads';
import './App.scss';
import { Input } from './Input';
import dictionary from "./dictionary.json"

console.log("Dictionary", dictionary)

const words = [
  "holly",
  "santa",
  "comet",
  "cupid",
  "vixen",
  "merry",
  "angel",
  "bells",
  "mince",
  "stuck",
  "snowy",
  "candy",
  "carol",
  "claus",
]

const validWords = new Set([
  ...Object.keys(dictionary).filter((w) => w.length === 5),
  ...words
])

interface Guess {
  guess: string
  letters: Array<"wrong" | "wrongplace" | "correct">
  success: boolean
}

type FoundRecord = Record<string, FoundLetter>
interface FoundLetter {
  expected: number
  found: number[] 
}

function App() {
  const [word] = useState(words[Math.floor(Math.random()*words.length)].toUpperCase())

  const [guesses, setGuesses] = useState<Guess[]>([])
  const [currentGuess, setGuess] = useState("     ")
  const [result, setResult] = useState("Enter Guess")
  const MAX_GUESSES = 6
  const MAX_CHARS = 5
  const refs:Array<Array<RefObject<HTMLInputElement>>> = [...Array(MAX_GUESSES)].map((i) => {
    return [...Array(MAX_CHARS)].map((j) => {
      return createRef<HTMLInputElement>()
    })
  })

  useEffect(() => {
    if (refs[0][0].current && document.activeElement === document.body)
      refs[0][0].current.focus()
  }, [refs])

  const makeGuess = () => {
    if (currentGuess.trim().length !== word.length)
      return

    if (!validWords.has(currentGuess.toLowerCase())){
      setResult("Please Enter A Valid Word")
      return
    }
    let guess: Guess
    let result: string = ""
    let isCorrect = false
    const found: FoundRecord = word.split("").reduce((curr: FoundRecord, char:string, i:number) => {
      if(!curr[char])
        curr[char] = {expected: 0, found: []}

      curr[char].expected++

      return curr
    },{} as FoundRecord)

    if (word === currentGuess){
      guess = {
        guess: currentGuess,
        letters: currentGuess.split("").map((c,i) => "correct"),
        success: true
      } as Guess
      result = "HO HO HO!"
      isCorrect = true
    } else {
      result = "TRY AGAIN!"
      const letters = currentGuess.split("").map((c,i) => {
        if(word.includes(c)) {
          found[c].found.push(i)
          return (i === word.indexOf(c)) ? "correct" : "wrongplace"
        } else {
          return "wrong"
        }
      })

      currentGuess.split("").forEach((c, i) => {
        if (found[c] && found[c].found.length > found[c].expected) {
          while(found[c].found.length > found[c].expected) {
            const index = found[c].found.pop()
            if (index === undefined)
              break

            if (letters[index] === "correct") {
              found[c].found.unshift(index)
            } else {
              letters[index] = "wrong"
            }
          }
        }
      })
      
      guess = {
        guess: currentGuess,
        letters,
        success: false
      } as Guess
      
    }

    if(guess) {
      setGuesses(g => [
        ...g,
        guess
      ])
      setGuess("     ")
      if (!isCorrect) {
        const row = guesses.length+1
        if (refs.length > row && refs[row].length > 0 && refs[row][0].current)
          refs[row][0].current!.focus()
      }
      setResult(result)
    }
  }
  

  const getClassName = (guess:number, letter:number) => {
    return guesses.length > guess ? guesses[guess].letters[letter] : ""
  }

  const getGuessClass = (guess: number) => {
    let klass = "guess"
    if (guesses.length > guess && guesses[guess].success)
      klass += " correct"

    return klass
  }

  const getLetter = (guess: number, index: number) => {
    if (guess === guesses.length)
      return currentGuess[index].trim()

    if (guess < guesses.length)
      return guesses[guess].guess[index]
    else
      return ""
  }

  const getResultClass = () => {
    switch (result) {
      case "HO HO HO!":
        return "success"
      case "TRY AGAIN!":
        return "failed"
      default:
        return ""
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Christmas Wordle</h1>
      </header>
      <main>
        <h2 className={getResultClass()}>{result}</h2>
        {[...Array(MAX_GUESSES).keys()].map((i) => (
          <Fragment key={i}>
            <div className={getGuessClass(i)}>
              {[...Array(MAX_CHARS).keys()].map((j) => (
                <Input
                  key={j}
                  ref={refs[i][j]}
                  className={getClassName(i,j)}
                  index={j}
                  value={getLetter(i,j)}
                  disabled={i < guesses.length}
                  setLetter={(index, char) => {
                    setGuess(g => {
                      const letters = g.split("")
                      letters[index] = char.toUpperCase()
                      return letters.join("")
                    })
                    const row = guesses.length
                    if (refs.length > i && refs[row].length > (index+1) && refs[row]![index+1]!.current)
                      refs[row]![index+1]!.current!.focus()
                  }}
                  focusInput={(index) => {
                    const row = guesses.length
                    if (refs.length > i && refs[row].length > (index+1) && refs[row]![index+1]!.current)
                      refs[row]![index+1]!.current!.focus()
                  }}
                  clearLetter={(index) => {
                    const row = guesses.length
                    let current = currentGuess.split("")
                    current[index] = " "
                    setGuess(g => {
                      const letters = g.split("")
                      letters[index] = " "
                      return letters.join("")
                    })
                    if (refs.length > i && refs[row].length > (index) && refs[row]![index]!.current) {
                      console.log("firing events", refs[row]![index]!.current!)
                      refs[row]![index]!.current!.focus()
                      refs[row]![index]!.current!.value = ""
                      const event = new window.CustomEvent("change")
                      refs[row]![index]!.current!.dispatchEvent(event)
                    }
                  }}
                  makeGuess={makeGuess}
                  style={{animationDelay: `${j * 100}ms`}}/> 
              ))}
            </div>
          </Fragment>
        ))}
      </main>
    </div>
  );
}

export default App;