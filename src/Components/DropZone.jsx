import { useDraggable, useDroppable } from "@dnd-kit/core";
import classNames from "classnames";

export default function DropZone({ answer, zoneId, word, isCheckingAnswers, kbActive, kbSelectedWord, onKbPlace, zoneRef, onKbSelectFromZone }) {
  const { setNodeRef: dropRef, isOver } = useDroppable({ id: `zone-${zoneId}` });
  const { setNodeRef: dragRef, attributes, listeners, isDragging } = useDraggable({
    id: `zone-${zoneId}`,
    disabled: !word,
  });

  const isCorrect = isCheckingAnswers && answer.split(";").includes(word?.word);
  const isWrong = isCheckingAnswers && !!word && !answer.split(";").includes(word.word);

  return <span
    ref={el => { dropRef(el); zoneRef?.(el); }}
    tabIndex={kbActive && !isCheckingAnswers ? 0 : -1}
    onKeyDown={e => {
      if (kbActive && !isCheckingAnswers && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onKbPlace?.(zoneId);
      }
    }}
    className={classNames("DropZone", {
      "DropZone--filled": !!word,
      "DropZone--over": isOver && !isDragging,
    })}
  >
    {word ? <span
      ref={dragRef}
      {...attributes}
      {...listeners}
      tabIndex={isCheckingAnswers || kbActive ? -1 : 0}
      onKeyDown={e => {
        if (!isCheckingAnswers && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onKbSelectFromZone?.(word);
        }
      }}
      className={classNames("WordChip", {
        "WordChip--ghost": isDragging,
        "WordChip--correct": isCorrect,
        "WordChip--wrong": isWrong,
        "WordChip--kb-selected": kbSelectedWord?.index === word.index,
      })}
    >{word.word}</span> : " "}
  </span>;
}
