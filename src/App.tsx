import React, {
  useEffect,
  useState,
} from "react"
import "./styles/App.scss"
import { Stats } from "./utils/stats"
import { State } from "./utils/state"
import { Game } from "./components/Game"

function App() {

  const [validWords, setValidWords] = useState(new Set<string>())
  const [stats] = useState(new Stats())
  const [state, setState] = useState<State>()
  async function getValidWords() {
    const {default: valid} = await import("./resources/valid.json")
    const {default: words} = await import("./resources/words.json")
    
    setState(new State(words))
    setValidWords(new Set([
      ...valid,
      ...words,
    ]))
  }

  useEffect(() => {
    getValidWords()
  },[])
  
  return (
    <>
      {state && (<Game state={state} stats={stats} validWords={validWords}/>)}
    </>
  )
}

export default App
