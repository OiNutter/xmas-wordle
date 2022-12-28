import { readStorage, writeStorage } from "./storage";

interface StatsRecord {
  gamesPlayed: number
  wins: number
  streak: number,
  maxStreak: number,
  guessCount: Record<number, number>
}

export class Stats {
  data: StatsRecord
  constructor() {
    this.data = readStorage("xmas-wordle-stats") ?? {
      gamesPlayed: 0,
      wins: 0,
      streak: 0,
      maxStreak:0,
      guessCount: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0
      }
    }
  }

  recordLoss() {
    this.data.gamesPlayed++
    if (this.data.streak > this.data.maxStreak)
      this.data.maxStreak = this.data.streak
    this.data.streak = 0
  }

  recordWin(guess:number) {
    this.data.gamesPlayed++
    this.data.wins++
    this.data.guessCount[guess]++
    this.data.streak++
    if (this.data.streak > this.data.maxStreak)
      this.data.maxStreak = this.data.streak
  }

  save() {
    writeStorage('xmas-wordle-stats', JSON.stringify(this.data))
  }
}