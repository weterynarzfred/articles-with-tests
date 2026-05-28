import classNames from "classnames";
import { useState } from "react";

export default function DropZone({
  answer,
  zoneId,
  word,
  onDrop,
  setAvailable,
  isCheckingAnswers
}) {
  const [dragDepth, setDragDepth] = useState(0);

  return <span
    draggable={!!word}
    onDragStart={e => {
      e.dataTransfer.setData("word", JSON.stringify(word));
      e.dataTransfer.setData("sourceZone", zoneId);
    }}
    onDragOver={e => {
      e.preventDefault();
    }}
    onDrop={e => {
      e.preventDefault();
      setDragDepth(0);

      const transferredWord = JSON.parse(e.dataTransfer.getData("word"));
      const sourceZone = e.dataTransfer.getData("sourceZone");

      if (parseInt(sourceZone) !== parseInt(zoneId)) {
        onDrop(zoneId, transferredWord);
        onDrop(sourceZone, null);
        if (word) setAvailable(prev => [...prev, word]);
      }

    }}
    onDragEnd={e => {
      if (e.dataTransfer.dropEffect === 'none') {
        onDrop(zoneId, null);
        if (word) setAvailable(prev => [...prev, word]);
      }
    }}
    onDragEnter={e => { e.preventDefault(); setDragDepth(d => d + 1); }}
    onDragLeave={e => { e.preventDefault(); setDragDepth(d => d - 1); }}
    className={classNames("DropZone", {
      "DropZone--correct": isCheckingAnswers && answer === word?.word,
      "DropZone--wrong": isCheckingAnswers && answer !== word?.word,
      "DropZone--dragging": dragDepth > 0,
      "DropZone--filled": !!word,
    })}
  >
    {word?.word || " "}
  </span>;
}
