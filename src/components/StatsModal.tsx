import { FC } from "react"
import { Stats } from "../utils/stats"

interface StatsProps {
  isOpen: boolean
  toggle: () => void
  stats: Stats
  current?: number
}

interface StatBoxProps {
  label: string,
  stat: string
}

const StatBox:FC<StatBoxProps> = ({label, stat}:StatBoxProps) => {
  return (
    <div className="stat-box">
      <span>{stat}</span>
      <label>{label}</label>
    </div>
  )
}

interface GuessBarProps {
  label: string,
  value: number,
  max: number,
  isCurrent?: boolean
}

const GuessBar:FC<GuessBarProps> = ({label, value, max, isCurrent=false}:GuessBarProps) => {
  return (
    <div className="guess-bar-wrapper">
      <label>{label}</label>
      <span className={`guess-bar ${isCurrent ? "current" : ""}`} style={{width: `${10 + ((value/max)*300)}px`}}>{value}</span>
    </div>
  )
}

export const StatsModal:FC<StatsProps> = ({isOpen, toggle, stats, current}: StatsProps) => {

  const getWinPercentage = () => {
    if (stats.data.wins === 0)
      return 0

    return Math.round((stats.data.wins/stats.data.gamesPlayed) * 100)
  }
  let maxGuessCount = 0
  Object.values(stats.data.guessCount).forEach((v) => {
    if (v > maxGuessCount)
      maxGuessCount = v
  })
  return (
    <>
      {isOpen && (
        <>
          <div className="modal-background" onClick={() => toggle() }></div>
          <div className="modal stats-modal">
            <button onClick={() => toggle()} className="close-button material-symbols-outlined">
              close
            </button>
            <h3>Statistics</h3>

            <div className="stats-counts">
              <StatBox label="Played" stat={`${stats.data.gamesPlayed}`}/>
              <StatBox label="Win %" stat={`${getWinPercentage()}%`}/>
              <StatBox label="Current Streak" stat={`${stats.data.streak}`}/>
              <StatBox label="Max Streak" stat={`${stats.data.maxStreak}`}/>
            </div>

            <h4>Guess Distribution</h4>
            <div className="guess-distribution">
              {Object.entries(stats.data.guessCount).map(([k,v], i) => (
                <GuessBar 
                  key={i} 
                  label={k} 
                  value={v} 
                  max={stats.data.wins}
                  isCurrent={current !== undefined && (`${current}` === k)}/>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}