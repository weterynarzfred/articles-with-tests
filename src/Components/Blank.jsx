import { useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";

export default function Blank({ answer, blankId, value = "", onChange, isCheckingAnswers }) {
  const sizerRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(null);

  useLayoutEffect(() => {
    if (sizerRef.current) setInputWidth(sizerRef.current.offsetWidth);
  }, [value]);

  const answers = (answer ?? "").split(";").map(a => a.trim().toLowerCase()).filter(Boolean);
  const trimmed = value.trim().toLowerCase();
  const isCorrect = isCheckingAnswers && trimmed !== "" && answers.includes(trimmed);
  const isWrong = isCheckingAnswers && trimmed !== "" && !answers.includes(trimmed);

  return (
    <>
      <span ref={sizerRef} className="Blank__sizer" aria-hidden="true">
        {value || " "}
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={isCheckingAnswers}
        style={inputWidth != null ? { width: `${inputWidth}px` } : undefined}
        className={classNames("Blank", {
          "Blank--correct": isCorrect,
          "Blank--wrong": isWrong,
        })}
      />
    </>
  );
}
