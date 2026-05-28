import { useState } from "react";
import { ChoiceSetContext } from "./ChoiceSetContext";

export default function ChoiceSet({ children }) {
  const [checked, setChecked] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  return <ChoiceSetContext.Provider value={{ checked, resetKey }}>
    <div className="ChoiceSet">
      {children}
      <div className="button-list">
        <button className="button" onClick={() => { setResetKey(k => k + 1); setChecked(false); }}>reset</button>
        <button className="button" onClick={() => setChecked(prev => !prev)}>
          {checked ? "stop checking" : "check answers"}
        </button>
      </div>
    </div>
  </ChoiceSetContext.Provider>;
}
