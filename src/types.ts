export type LetterState = "wrong" | "wrongplace" | "correct"

export interface Guess {
  guess: string
  letters: Array<LetterState>
  success: boolean
}

export type FoundRecord = Record<string, FoundLetter>
export interface FoundLetter {
  expected: number
  found: number[] 
}

export enum Results {
  SUCCESS="Ho Ho Ho!",
  FAILED="Looks like you got stuck!"
}