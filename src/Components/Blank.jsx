import { useEffect, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";

export default function Blank({ answer, blankId, value = "", onChange, isCheckingAnswers, inputRef, onEnter }) {
  const sizerRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(null);

  const measure = () => {
    if (sizerRef.current) setInputWidth(sizerRef.current.offsetWidth);
  };

  useEffect(() => {
    document.fonts.ready.then(measure);
  }, []);

  useLayoutEffect(measure, [value]);

  const answers = (answer ?? "").split(";").map(a => a.trim().toLowerCase()).filter(Boolean);
  const trimmed = value.trim().toLowerCase();
  const isCorrect = isCheckingAnswers && trimmed !== "" && answers.includes(trimmed);
  const isWrong = isCheckingAnswers && trimmed !== "" && !answers.includes(trimmed);

  return <>
    <span ref={sizerRef} className="Blank__sizer" aria-hidden="true">
      {value || " "}
    </span>
    <input
      ref={inputRef}
      type="text"
      aria-label="fill in the blank"
      value={value}
      onChange={e => onChange?.(e.target.value)}
      onKeyDown={e => { if (e.key === "Enter") onEnter?.(); }}
      disabled={isCheckingAnswers}
      style={inputWidth != null ? { width: `${inputWidth}px` } : undefined}
      className={classNames("Blank", {
        "Blank--correct": isCorrect,
        "Blank--wrong": isWrong,
      })}
    />
    {isWrong && <span className="Blank__answer">{answers[0]}</span>}
  </>;
}
