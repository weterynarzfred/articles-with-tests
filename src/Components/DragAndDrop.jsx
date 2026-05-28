import React, { useMemo, useRef, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import classNames from "classnames";
import DropZone from "./DropZone";

function DraggableWord({ word }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({ id: `pool-${word.index}` });
  return (
    <span
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={classNames("WordChip", { "WordChip--ghost": isDragging })}
    >
      {word.word}
    </span>
  );
}

function PoolArea({ available }) {
  const { setNodeRef, isOver } = useDroppable({ id: "pool" });
  return <div ref={setNodeRef} className={classNames("DragAndDrop__words", { "DragAndDrop__words--over": isOver })}>
    {available.map(word => (
      <DraggableWord key={word.index} word={word} />
    ))}
  </div>;
}

export default function DragAndDrop({ words, children }) {
  const wordList = useMemo(() =>
    words.split(";").map((w, index) => ({ word: w.trim(), index })).filter(w => w.word !== ""),
    [words]);

  const [zones, setZones] = useState({});
  const [available, setAvailable] = useState(wordList);
  const [isCheckingAnswers, setIsCheckingAnswers] = useState(false);
  const [activeWord, setActiveWord] = useState(null);

  const nextZoneId = useRef(0);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = ({ active }) => {
    const id = String(active.id);
    if (id.startsWith("pool-"))
      setActiveWord(available.find(w => w.index === parseInt(id.slice(5))) ?? null);
    else if (id.startsWith("zone-"))
      setActiveWord(zones[parseInt(id.slice(5))] ?? null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveWord(null);

    const activeId = String(active.id);
    const isFromZone = activeId.startsWith("zone-");
    const sourceZoneId = isFromZone ? parseInt(activeId.slice(5)) : null;
    const sourceWord = isFromZone
      ? zones[sourceZoneId]
      : available.find(w => w.index === parseInt(activeId.slice(5)));

    if (!sourceWord) return;

    if (!over) {
      if (isFromZone) {
        setZones(prev => ({ ...prev, [sourceZoneId]: null }));
        setAvailable(prev => [...prev, sourceWord]);
      }
      return;
    }

    const overId = String(over.id);

    if (overId === "pool") {
      if (isFromZone) {
        setZones(prev => ({ ...prev, [sourceZoneId]: null }));
        setAvailable(prev => [...prev, sourceWord]);
      }
    } else if (overId.startsWith("zone-")) {
      const destZoneId = parseInt(overId.slice(5));
      if (sourceZoneId === destZoneId) return;

      const displaced = zones[destZoneId] ?? null;

      if (isFromZone) {
        setZones(prev => ({ ...prev, [destZoneId]: sourceWord, [sourceZoneId]: displaced }));
      } else {
        setZones(prev => ({ ...prev, [destZoneId]: sourceWord }));
        setAvailable(prev => {
          const next = prev.filter(w => w.index !== sourceWord.index);
          return displaced ? [...next, displaced] : next;
        });
      }
    }
  };

  const enhance = node => {
    if (!React.isValidElement(node)) return node;
    const enhanced = node.props?.children
      ? React.Children.map(node.props.children, enhance)
      : node.props.children;
    if (node.type === DropZone) {
      const id = nextZoneId.current++;
      return React.cloneElement(node, { zoneId: id, word: zones[id], isCheckingAnswers, children: enhanced });
    }
    if (enhanced !== node.props.children)
      return React.cloneElement(node, undefined, enhanced);
    return node;
  };

  nextZoneId.current = 0;
  const enhancedTree = React.Children.map(children, enhance);

  return <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div className="DragAndDrop">
      <PoolArea available={available} />
      <div className="DragAndDrop__text">{enhancedTree}</div>
      <div className="button-list">
        <button className="button" onClick={() => { setAvailable(wordList); setZones({}); setIsCheckingAnswers(false); }}>reset</button>
        <button className="button" onClick={() => setIsCheckingAnswers(prev => !prev)}>
          {isCheckingAnswers ? "stop checking" : "check answers"}
        </button>
      </div>
    </div>
    <DragOverlay dropAnimation={null}>
      {activeWord && <span className="WordChip WordChip--overlay">{activeWord.word}</span>}
    </DragOverlay>
  </DndContext>;
}
