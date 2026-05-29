import classNames from "classnames";

export default function Choice({ correct, explanation, children, index, selected, onToggle, checked }) {
  return <div
    className={classNames("Choice", {
      "Choice--selected": selected,
      "Choice--correct": checked && correct && selected,
      "Choice--missed": checked && correct && !selected,
      "Choice--wrong": checked && !correct && selected,
    })}
    onClick={() => onToggle(index)}
  >
    <span className="Choice__marker" />
    <span className="Choice__label">{children}</span>
    {checked && explanation && (correct || selected) &&
      <p className="Choice__explanation">{explanation}</p>}
  </div>;
}
