import { Guess, LetterState } from "../types"
import { readStorage, writeStorage } from "./storage"

interface StateRecord {
  currentWord: string
  guesses: Guess[]
  currentGuess: string
  usedLetters: Record<string, LetterState>
}
export class State {
  data: StateRecord
  constructor(words: string[]) {
    const data = readStorage("xmas-wordle-state") ?? {
      guesses: [],
      currentGuess: "     ",
      usedLetters: {}
    }

    if (!data.currentWord) {
      data.currentWord = words[Math.floor(Math.random()*words.length)].toUpperCase()
      this.save(data)
    }
    
    this.data = data
  }

  updateCurrentGuess(currentGuess: string) {
    this.data.currentGuess = currentGuess
    this.save()
  }

  addGuess(guess: Guess, usedLetters: Record<string, LetterState>) {
    this.data.guesses.push(guess)
    this.data.usedLetters = usedLetters
    this.save()
  }

  clearState() {
    console.log("CLEARING DATA")
    const data = {
      currentGuess: "     ",
      guesses: [],
      usedLetters: {}
    }
    this.save(data)
  }

  save(data?: Record<string, unknown>) {
    console.log("saving", data, data??this.data)
    writeStorage('xmas-wordle-state', JSON.stringify(data ?? this.data))
  }
}