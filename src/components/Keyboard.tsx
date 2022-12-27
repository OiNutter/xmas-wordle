import { ComponentProps, FC} from "react"
import { LetterState } from "../App"

interface KeyboardProps {
  used: Record<string, LetterState>
  setLetter: (letter:string) => void
  clearLetter: () => void
  submit: () => void
}
interface KeyboardButtonProps extends ComponentProps<"button"> {
  letter: string,
  state?: LetterState
}

const rows = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["enter", "Z","X","C","V","B","N","M","backspace"]
]

const KeyboardButton:FC<KeyboardButtonProps> = ({letter, state, className, ...props}:KeyboardButtonProps) => {
  let klass = `keyboard-button ${className ?? ""} ${letter}`
  if (state)
    klass += ` ${state}`

  if (letter === "backspace")
    klass += " material-symbols-outlined"

  return (
    <button className={klass} {...props}>{letter}</button>
  )
}
export const Keyboard:FC<KeyboardProps> = ({used, setLetter, clearLetter, submit}:KeyboardProps) => {
  return (
    <div className="keyboard">
      {rows.map((r, i) => (
        <div className="keyboard-row" key={i}>
        {r.map((k, j) => (
          <KeyboardButton 
            key={j}
            letter={k} 
            state={used[k]}
            onClick={() => {
              if (k === "enter")
                submit()
              else if (k === "backspace")
                clearLetter()
              else
                setLetter(k)
            }}/>
        ))}
        </div>
      ))}
    </div>
  )
}