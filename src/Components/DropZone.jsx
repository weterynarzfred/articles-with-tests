import { useDraggable, useDroppable } from "@dnd-kit/core";
import classNames from "classnames";

export default function DropZone({ answer, zoneId, word, isCheckingAnswers }) {
  const { setNodeRef: dropRef, isOver } = useDroppable({ id: `zone-${zoneId}` });
  const { setNodeRef: dragRef, attributes, listeners, isDragging } = useDraggable({
    id: `zone-${zoneId}`,
    disabled: !word,
  });

  const isCorrect = isCheckingAnswers && answer.split(";").includes(word?.word);
  const isWrong = isCheckingAnswers && !!word && !answer.split(";").includes(word.word);

  return <span
    ref={dropRef}
    className={classNames("DropZone", {
      "DropZone--filled": !!word,
      "DropZone--over": isOver && !isDragging,
    })}
  >
    {word ? <span
      ref={dragRef}
      {...attributes}
      {...listeners}
      className={classNames("WordChip", {
        "WordChip--ghost": isDragging,
        "WordChip--correct": isCorrect,
        "WordChip--wrong": isWrong,
      })}
    >{word.word}</span> : " "}
  </span>;
}
