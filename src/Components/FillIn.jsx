import React, { useRef, useState } from "react";
import Blank from "./Blank";

export default function FillIn({ children }) {
  const [values, setValues] = useState({});
  const [isCheckingAnswers, setIsCheckingAnswers] = useState(false);
  const nextBlankId = useRef(0);
  const blankRefs = useRef({});
  const checkButtonRef = useRef(null);

  const enhance = node => {
    if (!React.isValidElement(node)) return node;
    const enhanced = node.props?.children
      ? React.Children.map(node.props.children, enhance)
      : node.props.children;
    if (node.type === Blank) {
      const id = nextBlankId.current++;
      return React.cloneElement(node, {
        blankId: id,
        value: values[id] ?? "",
        onChange: val => setValues(prev => ({ ...prev, [id]: val })),
        isCheckingAnswers,
        inputRef: el => { blankRefs.current[id] = el; },
        onEnter: () => {
          const next = blankRefs.current[id + 1];
          if (next) next.focus();
          else checkButtonRef.current?.focus();
        },
      });
    }
    if (enhanced !== node.props.children)
      return React.cloneElement(node, undefined, enhanced);
    return node;
  };

  nextBlankId.current = 0;
  const enhancedTree = React.Children.map(children, enhance);

  return <div className="FillIn">
    <div className="FillIn__text">{enhancedTree}</div>
    <div className="button-list">
      <button className="button" onClick={() => { setValues({}); setIsCheckingAnswers(false); }}>reset</button>
      <button className="button" ref={checkButtonRef} onClick={() => setIsCheckingAnswers(prev => !prev)}>
        {isCheckingAnswers ? "stop checking" : "check answers"}
      </button>
    </div>
  </div>;
}
