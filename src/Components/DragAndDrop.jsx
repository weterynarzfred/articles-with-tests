import React, { useMemo, useRef, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import classNames from "classnames";
import DropZone from "./DropZone";

function DraggableWord({ word, kbSelected, onKbSelect, chipRef }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({ id: `pool-${word.index}` });
  return (
    <span
      ref={el => { setNodeRef(el); chipRef?.(el); }}
      {...attributes}
      {...listeners}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onKbSelect?.(word);
        }
      }}
      className={classNames("WordChip", {
        "WordChip--ghost": isDragging,
        "WordChip--kb-selected": kbSelected,
      })}
    >
      {word.word}
    </span>
  );
}

function PoolArea({ available, kbSelectedWord, onKbSelect, getChipRef }) {
  const { setNodeRef, isOver } = useDroppable({ id: "pool" });
  return <div ref={setNodeRef} className={classNames("DragAndDrop__words", { "DragAndDrop__words--over": isOver })}>
    {available.map(word => (
      <DraggableWord
        key={word.index}
        word={word}
        kbSelected={kbSelectedWord?.index === word.index}
        onKbSelect={onKbSelect}
        chipRef={getChipRef(word.index)}
      />
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
  const [kbSelectedWord, setKbSelectedWord] = useState(null);

  const nextZoneId = useRef(0);
  const chipRefs = useRef({});
  const zoneRefs = useRef({});
  const checkButtonRef = useRef(null);

  const getChipRef = wordIndex => el => { chipRefs.current[wordIndex] = el; };

  const handleKbSelect = (word, sourceZoneId = null) => {
    if (kbSelectedWord?.index === word.index) {
      setAvailable(prev => [...prev, word]);
      setKbSelectedWord(null);
      return;
    }
    if (kbSelectedWord) setAvailable(prev => [...prev, kbSelectedWord]);
    if (sourceZoneId !== null) {
      setZones(prev => ({ ...prev, [sourceZoneId]: null }));
      setTimeout(() => zoneRefs.current[sourceZoneId]?.focus(), 0);
    } else {
      setAvailable(prev => prev.filter(w => w.index !== word.index));
      const zoneIds = Object.keys(zoneRefs.current).map(Number).sort((a, b) => a - b);
      const firstEmpty = zoneIds.find(id => !zones[id]);
      setTimeout(() => zoneRefs.current[firstEmpty ?? zoneIds[0]]?.focus(), 0);
    }
    setKbSelectedWord(word);
  };

  const handleKbPlace = zoneId => {
    const word = kbSelectedWord;
    const displaced = zones[zoneId] ?? null;
    const newAvailable = displaced ? [...available, displaced] : [...available];
    setZones(prev => ({ ...prev, [zoneId]: word }));
    setAvailable(newAvailable);
    setKbSelectedWord(null);
    setTimeout(() => {
      if (newAvailable.length > 0) chipRefs.current[newAvailable[0].index]?.focus();
      else checkButtonRef.current?.focus();
    }, 0);
  };

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
      return React.cloneElement(node, {
        zoneId: id,
        word: zones[id],
        isCheckingAnswers,
        children: enhanced,
        kbActive: kbSelectedWord !== null,
        kbSelectedWord,
        onKbPlace: handleKbPlace,
        zoneRef: el => { zoneRefs.current[id] = el; },
        onKbSelectFromZone: word => handleKbSelect(word, id),
      });
    }
    if (enhanced !== node.props.children)
      return React.cloneElement(node, undefined, enhanced);
    return node;
  };

  nextZoneId.current = 0;
  const enhancedTree = React.Children.map(children, enhance);

  const handleKbEscape = () => {
    if (!kbSelectedWord) return;
    setAvailable(prev => [...prev, kbSelectedWord]);
    setKbSelectedWord(null);
  };

  return <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div className="DragAndDrop" onKeyDown={e => { if (e.key === "Escape") handleKbEscape(); }}>
      <PoolArea
        available={available}
        kbSelectedWord={kbSelectedWord}
        onKbSelect={handleKbSelect}
        getChipRef={getChipRef}
      />
      <div className="DragAndDrop__text">{enhancedTree}</div>
      <div className="button-list">
        <button className="button" onClick={() => { setAvailable(wordList); setZones({}); setIsCheckingAnswers(false); setKbSelectedWord(null); }}>reset</button>
        <button className="button" ref={checkButtonRef} onClick={() => setIsCheckingAnswers(prev => !prev)}>
          {isCheckingAnswers ? "stop checking" : "check answers"}
        </button>
      </div>
    </div>
    <DragOverlay dropAnimation={null}>
      {activeWord && <span className="WordChip WordChip--overlay">{activeWord.word}</span>}
    </DragOverlay>
  </DndContext>;
}
