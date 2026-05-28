import React, { useContext, useEffect, useState } from "react";
import { ChoiceSetContext } from "./ChoiceSetContext";

export default function Choices({ children }) {
  const ctx = useContext(ChoiceSetContext);

  const [selected, setSelected] = useState(new Set());
  const [ownChecked, setOwnChecked] = useState(false);

  const checked = ctx ? ctx.checked : ownChecked;

  useEffect(() => {
    setSelected(new Set());
  }, [ctx?.resetKey]);

  const toggle = (index) => {
    if (checked) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const enhanced = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, {
      index,
      selected: selected.has(index),
      onToggle: toggle,
      checked,
    });
  });

  return (
    <div className="Choices">
      <div className="Choices__options">{enhanced}</div>
      {!ctx && (
        <div className="button-list">
          <button className="button" onClick={() => { setSelected(new Set()); setOwnChecked(false); }}>reset</button>
          <button className="button" onClick={() => setOwnChecked(prev => !prev)}>
            {ownChecked ? "stop checking" : "check answers"}
          </button>
        </div>
      )}
    </div>
  );
}
