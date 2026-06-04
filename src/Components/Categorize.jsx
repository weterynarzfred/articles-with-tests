import React, { useEffect, useMemo, useRef, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import classNames from "classnames";

function DraggableCatWord({ word, draggableId, checked, correct, kbSelected, onKbSelect, chipRef, kbActive }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({ id: draggableId });
  return (
    <span
      ref={el => { setNodeRef(el); chipRef?.(el); }}
      {...attributes}
      {...listeners}
      tabIndex={checked || kbActive ? -1 : 0}
      aria-pressed={kbSelected}
      onKeyDown={e => {
        if (!checked && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onKbSelect?.(word.index);
        }
      }}
      className={classNames("WordChip", {
        "WordChip--ghost": isDragging,
        "WordChip--correct": checked && correct,
        "WordChip--wrong": checked && correct === false,
        "WordChip--kb-selected": kbSelected,
      })}
    >
      {word.word}
    </span>
  );
}

function CategoryBucket({ category, words, checked, kbActive, onKbPlace, bucketRef, kbSelectedWord, onKbSelect, getChipRef }) {
  const { setNodeRef, isOver } = useDroppable({ id: `cat-${category.index}` });
  return (
    <div
      className={classNames("CategoryBucket", { "CategoryBucket--kb-active": kbActive })}
      role="button"
      aria-label={category.label}
      tabIndex={kbActive ? 0 : -1}
      ref={bucketRef}
      onKeyDown={e => {
        if (kbActive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onKbPlace(category.index);
        }
      }}
    >
      <div className="CategoryBucket__label">{category.label}</div>
      <div
        ref={setNodeRef}
        className={classNames("CategoryBucket__words", { "CategoryBucket__words--over": isOver })}
      >
        {words.map(word => (
          <DraggableCatWord
            key={word.index}
            word={word}
            draggableId={`cat-${category.index}-${word.index}`}
            checked={checked}
            correct={category.answers.includes(word.word)}
            kbSelected={kbSelectedWord === word.index}
            onKbSelect={onKbSelect}
            chipRef={getChipRef(word.index)}
            kbActive={kbActive}
          />
        ))}
      </div>
    </div>
  );
}

function CatPool({ words, kbSelectedWord, onKbSelect, getChipRef }) {
  const { setNodeRef, isOver } = useDroppable({ id: "pool" });
  return <div ref={setNodeRef} aria-label="word pool" className={classNames("Categorize__pool", { "Categorize__pool--over": isOver })}>
    {words.map(word => (
      <DraggableCatWord
        key={word.index}
        word={word}
        draggableId={`pool-${word.index}`}
        kbSelected={kbSelectedWord === word.index}
        onKbSelect={onKbSelect}
        chipRef={getChipRef(word.index)}
      />
    ))}
  </div>;
}

export default function Categorize({ words, children }) {
  const wordList = useMemo(() =>
    words.split(";").map((w, index) => ({ word: w.trim(), index })).filter(w => w.word !== ""),
    [words]);

  const categories = useMemo(() =>
    React.Children.toArray(children)
      .filter(React.isValidElement)
      .map((child, i) => ({
        index: i,
        label: child.props.label,
        answers: (child.props.answer || "").split(";").map(s => s.trim()).filter(Boolean),
      })),
    [children]);

  const [placements, setPlacements] = useState({});
  const [checked, setChecked] = useState(false);
  const [activeWord, setActiveWord] = useState(null);
  const [kbSelectedWord, setKbSelectedWord] = useState(null);

  const chipRefs = useRef({});
  const bucketRefs = useRef({});
  const checkButtonRef = useRef(null);

  const getChipRef = wordIndex => el => { chipRefs.current[wordIndex] = el; };

  useEffect(() => {
    if (kbSelectedWord !== null) bucketRefs.current[0]?.focus();
  }, [kbSelectedWord]);

  const handleKbSelect = wordIndex => {
    setKbSelectedWord(prev => prev === wordIndex ? null : wordIndex);
  };

  const handleKbPlace = catIndex => {
    const wordIndex = kbSelectedWord;
    const newPlacements = { ...placements, [wordIndex]: catIndex };
    const remaining = wordList.filter(w => newPlacements[w.index] === undefined);
    setPlacements(newPlacements);
    setKbSelectedWord(null);
    setTimeout(() => {
      if (remaining.length > 0) chipRefs.current[remaining[0].index]?.focus();
      else checkButtonRef.current?.focus();
    }, 0);
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const poolWords = wordList.filter(w => placements[w.index] === undefined);
  const getCategoryWords = i => wordList.filter(w => placements[w.index] === i);

  const handleDragStart = ({ active }) => {
    const parts = String(active.id).split("-");
    const wordIndex = parseInt(parts[parts.length - 1]);
    setActiveWord(wordList.find(w => w.index === wordIndex) ?? null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveWord(null);
    if (!over) return;

    const parts = String(active.id).split("-");
    const wordIndex = parseInt(parts[parts.length - 1]);
    const overId = String(over.id);

    if (overId === "pool") {
      setPlacements(prev => { const next = { ...prev }; delete next[wordIndex]; return next; });
    } else if (overId.startsWith("cat-")) {
      const catIndex = parseInt(overId.slice(4));
      setPlacements(prev => ({ ...prev, [wordIndex]: catIndex }));
    }
  };

  return <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div className="Categorize" onKeyDown={e => { if (e.key === "Escape") setKbSelectedWord(null); }}>
      <CatPool
        words={poolWords}
        kbSelectedWord={kbSelectedWord}
        onKbSelect={handleKbSelect}
        getChipRef={getChipRef}
      />
      <div className="Categorize__buckets">
        {categories.map(cat => (
          <CategoryBucket
            key={cat.index}
            category={cat}
            words={getCategoryWords(cat.index)}
            checked={checked}
            kbActive={kbSelectedWord !== null}
            onKbPlace={handleKbPlace}
            bucketRef={el => { bucketRefs.current[cat.index] = el; }}
            kbSelectedWord={kbSelectedWord}
            onKbSelect={handleKbSelect}
            getChipRef={getChipRef}
          />
        ))}
      </div>
      <div className="button-list">
        <button className="button" onClick={() => { setPlacements({}); setChecked(false); setKbSelectedWord(null); }}>reset</button>
        <button className="button" ref={checkButtonRef} onClick={() => setChecked(p => !p)}>
          {checked ? "stop checking" : "check answers"}
        </button>
      </div>
    </div>
    <DragOverlay dropAnimation={null}>
      {activeWord && <span className="WordChip WordChip--overlay">{activeWord.word}</span>}
    </DragOverlay>
  </DndContext>;
}
