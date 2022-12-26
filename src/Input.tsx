import {
  forwardRef,
  ForwardRefExoticComponent,
  HTMLAttributes,
  HTMLProps,
  RefAttributes,
  useEffect,
  useState,
} from "react"

interface InputProps
  extends HTMLAttributes<HTMLInputElement>,
    HTMLProps<HTMLInputElement> {
  setLetter: (index: number, char: string) => void
  focusInput: (index: number) => void
  clearLetter: (index: number) => void
  index: number
  makeGuess: () => void
}

export const Input: ForwardRefExoticComponent<
  InputProps & RefAttributes<HTMLInputElement>
> = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      index,
      value,
      setLetter,
      clearLetter,
      focusInput,
      makeGuess,
      style,
      className,
      ...props
    }: InputProps,
    ref
  ) => {
    const [klass, setKlass] = useState(`input-tile`)
    useEffect(() => {
      setKlass(`input-tile ${className} ${value !== "" ? "filled" : ""}`)
    }, [value, className])
    return (
      <div className={klass}>
        <div
          className="tile-inner"
          style={style}
          onClick={() => {
            if (!props.disabled) focusInput(index)
          }}
        >
          {value}
        </div>
        <input
          type="text"
          ref={ref}
          maxLength={1}
          defaultValue={value}
          onFocus={(e) => {
            e.preventDefault()
          }}
          onChange={(e) => {
            setLetter(index, e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              makeGuess()
            } else if (e.key === "Backspace") {
              clearLetter(value !== "" ? index : index - 1)
            }
          }}
          {...props}
        />
      </div>
    )
  }
)
