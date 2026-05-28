import React, { useMemo, useRef, useState } from "react";
import DropZone from "./DropZone";

export default function DragAndDrop({ words, children }) {
  const wordList = useMemo(() => words.split(";")
    .map((w, index) => ({ word: w.trim(), index }))
    .filter(w => w.word !== ""),
    [words]);

  const [zones, setZones] = useState({});
  const [available, setAvailable] = useState(wordList);
  const [isCheckingAnswers, setIsCheckingAnswers] = useState(false);

  const nextZoneId = useRef(0);

  const handleDrop = (zoneId, word) => {
    setZones(prev => ({ ...prev, [zoneId]: word }));
    setAvailable(prev => prev.filter(w => w.index !== word?.index));
  };

  const enhance = node => {
    if (!React.isValidElement(node)) return node;

    const children = node.props?.children
      ? React.Children.map(node.props.children, enhance)
      : node.props.children;

    if (node.type === DropZone) {
      const id = nextZoneId.current++;
      return React.cloneElement(node, {
        zoneId: id,
        word: zones[id],
        onDrop: handleDrop,
        setAvailable: setAvailable,
        isCheckingAnswers: isCheckingAnswers,
        children,
      });
    }

    if (children !== node.props.children)
      return React.cloneElement(node, undefined, children);

    return node;
  };

  nextZoneId.current = 0;
  const enhancedTree = React.Children.map(children, enhance);

  return <div className="DragAndDrop">
    <div className="DragAndDrop__words">
      {available.map(word => (
        <span
          key={`${word.word}-${word.index}`}
          draggable
          onDragStart={e => e.dataTransfer.setData("word", JSON.stringify(word))}
        >
          {word.word}
        </span>
      ))}
    </div>
    <div className="DragAndDrop__text">{enhancedTree}</div>
    <div className="button-list">
      <button className="button" onClick={() => {
        setAvailable(wordList);
        setZones({});
      }}>reset</button>
      <button className="button" onClick={() => setIsCheckingAnswers(prev => !prev)}>
        {isCheckingAnswers ? 'stop checking' : 'check answers'}
      </button>
    </div>
  </div>;
}
