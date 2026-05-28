import React, { useMemo, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import classNames from "classnames";

function DraggableCatWord({ word, draggableId, checked, correct }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({ id: draggableId });
  return (
    <span
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={classNames("WordChip", {
        "WordChip--ghost": isDragging,
        "WordChip--correct": checked && correct,
        "WordChip--wrong": checked && correct === false,
      })}
    >
      {word.word}
    </span>
  );
}

function CategoryBucket({ category, words, checked }) {
  const { setNodeRef, isOver } = useDroppable({ id: `cat-${category.index}` });
  return (
    <div className="CategoryBucket">
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
          />
        ))}
      </div>
    </div>
  );
}

function CatPool({ words }) {
  const { setNodeRef, isOver } = useDroppable({ id: "pool" });
  return <div ref={setNodeRef} className={classNames("Categorize__pool", { "Categorize__pool--over": isOver })}>
    {words.map(word => (
      <DraggableCatWord
        key={word.index}
        word={word}
        draggableId={`pool-${word.index}`}
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
    <div className="Categorize">
      <CatPool words={poolWords} />
      <div className="Categorize__buckets">
        {categories.map(cat => (
          <CategoryBucket key={cat.index} category={cat} words={getCategoryWords(cat.index)} checked={checked} />
        ))}
      </div>
      <div className="button-list">
        <button className="button" onClick={() => { setPlacements({}); setChecked(false); }}>reset</button>
        <button className="button" onClick={() => setChecked(p => !p)}>
          {checked ? "stop checking" : "check answers"}
        </button>
      </div>
    </div>
    <DragOverlay dropAnimation={null}>
      {activeWord && <span className="WordChip WordChip--overlay">{activeWord.word}</span>}
    </DragOverlay>
  </DndContext>;
}
