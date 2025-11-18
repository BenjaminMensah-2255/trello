'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Card {
  id: string;
  title: string;
  description?: string;
  image?: string;
  attachments?: number;
  comments?: number;
  dueDate?: string;
  priority?: 'high' | 'medium';
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

// Sortable Card Component
function SortableCard({ card, onClick }: { card: Card; onClick?: (card: Card) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-lg border border-slate-200 bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
        isDragging ? 'opacity-50 rotate-2 shadow-xl' : ''
      }`}
      onClick={() => onClick?.(card)}
    >
      {card.image && (
        <div 
          className="mb-2 w-full aspect-video rounded-md bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${card.image}")` }}
        />
      )}
      
      <p className="text-sm font-medium text-slate-800">{card.title}</p>
      
      {(card.comments !== undefined || card.attachments !== undefined || card.dueDate !== undefined) && (
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          {card.attachments !== undefined && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">attachment</span>
              {card.attachments}
            </span>
          )}
          {card.comments !== undefined && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">chat_bubble</span>
              {card.comments}
            </span>
          )}
          {card.dueDate !== undefined && (
            <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              card.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <span className="material-symbols-outlined text-[12px]">calendar_today</span>
              {card.dueDate}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Sortable Column Component
function SortableColumn({ 
  column, 
  onCardClick 
}: { 
  column: Column; 
  onCardClick?: (card: Card) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex w-80 shrink-0 flex-col gap-4 rounded-xl bg-slate-100 p-4 ${
        isDragging ? 'opacity-50 rotate-1 shadow-2xl' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 
          className="font-bold text-slate-800 cursor-grab active:cursor-grabbing flex items-center gap-2"
          {...listeners}
        >
          <span className="material-symbols-outlined text-lg">drag_indicator</span>
          {column.title}
          <span className="text-sm font-normal text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
            {column.cards.length}
          </span>
        </h2>
        <button className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-200 transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
      
      <SortableContext items={column.cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[100px]">
          {column.cards.map((card) => (
            <SortableCard key={card.id} card={card} onClick={onCardClick} />
          ))}
        </div>
      </SortableContext>
      
      <button className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors">
        <span className="material-symbols-outlined">add</span>
        Add a card
      </button>
    </div>
  );
}

interface AdvancedDraggableWorkspaceProps {
  onCardClick?: (card: Card) => void;
}

export default function AdvancedDraggableWorkspace({ onCardClick }: AdvancedDraggableWorkspaceProps) {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: '📋 To Do',
      cards: [
        { 
          id: 'card-1', 
          title: 'Finalize Q4 budget proposal and submit for approval', 
          description: 'Review and submit budget for approval',
          comments: 3,
          dueDate: 'Oct 25',
          priority: 'high'
        },
        { 
          id: 'card-2', 
          title: 'Draft initial concepts for the new landing page design', 
          attachments: 2,
          comments: 1
        },
        { 
          id: 'card-3', 
          title: 'Research competitor marketing strategies', 
          description: 'Analyze what competitors are doing in Q4'
        },
      ],
    },
    {
      id: 'in-progress',
      title: '⚡ In Progress',
      cards: [
        { 
          id: 'card-4', 
          title: 'Develop social media content calendar for November', 
          description: 'Plan and schedule social media posts',
          comments: 5,
          attachments: 3
        },
        { 
          id: 'card-5', 
          title: 'Onboard new marketing intern', 
          dueDate: 'Oct 20',
          priority: 'medium'
        },
        { 
          id: 'card-6', 
          title: 'Run A/B tests on email campaign subject lines', 
          attachments: 1,
          comments: 2
        },
      ],
    },
    {
      id: 'review',
      title: '👀 In Review',
      cards: [
        { 
          id: 'card-7', 
          title: 'Review email marketing campaign drafts', 
          description: 'Provide feedback on campaign content',
          comments: 4
        },
        { 
          id: 'card-8', 
          title: 'Q3 performance analytics report', 
          attachments: 5,
          comments: 1
        },
      ],
    },
    {
      id: 'done',
      title: '✅ Done',
      cards: [
        { 
          id: 'card-9', 
          title: 'Analyze results from Q3 influencer collaborations', 
          attachments: 2,
          comments: 0
        },
        { 
          id: 'card-10', 
          title: 'Team meeting notes and action items', 
          description: 'Document key decisions and next steps'
        },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'card' | 'column' | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Determine if we're dragging a column or card
    const isColumn = columns.some(col => col.id === active.id);
    setActiveType(isColumn ? 'column' : 'card');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Column reordering
    if (activeType === 'column') {
      const activeIndex = columns.findIndex(col => col.id === activeId);
      const overIndex = columns.findIndex(col => col.id === overId);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        setColumns(columns => arrayMove(columns, activeIndex, overIndex));
      }
      return;
    }

    // Card reordering between columns
    let activeColumnIndex = -1;
    let activeCardIndex = -1;
    let overColumnIndex = -1;
    let overCardIndex = -1;

    // Find active card position
    columns.forEach((column, colIndex) => {
      column.cards.forEach((card, cardIndex) => {
        if (card.id === activeId) {
          activeColumnIndex = colIndex;
          activeCardIndex = cardIndex;
        }
      });
    });

    // Check if dropping on a column
    const overColumn = columns.find(col => col.id === overId);
    if (overColumn) {
      overColumnIndex = columns.findIndex(col => col.id === overId);
      overCardIndex = overColumn.cards.length;
    } else {
      // Find over card position
      columns.forEach((column, colIndex) => {
        column.cards.forEach((card, cardIndex) => {
          if (card.id === overId) {
            overColumnIndex = colIndex;
            overCardIndex = cardIndex;
          }
        });
      });
    }

    if (activeColumnIndex === -1 || overColumnIndex === -1) return;

    // Same column reordering
    if (activeColumnIndex === overColumnIndex) {
      const newCards = arrayMove(
        columns[activeColumnIndex].cards,
        activeCardIndex,
        overCardIndex
      );

      setColumns(columns => {
        const newColumns = [...columns];
        newColumns[activeColumnIndex] = {
          ...newColumns[activeColumnIndex],
          cards: newCards,
        };
        return newColumns;
      });
    } else {
      // Moving between columns
      const activeColumn = columns[activeColumnIndex];
      const overColumn = columns[overColumnIndex];
      const activeCard = activeColumn.cards[activeCardIndex];

      setColumns(columns => {
        const newColumns = [...columns];
        
        // Remove from active column
        newColumns[activeColumnIndex] = {
          ...activeColumn,
          cards: activeColumn.cards.filter(card => card.id !== activeId),
        };
        
        // Add to over column
        newColumns[overColumnIndex] = {
          ...overColumn,
          cards: [
            ...overColumn.cards.slice(0, overCardIndex),
            activeCard,
            ...overColumn.cards.slice(overCardIndex),
          ],
        };
        
        return newColumns;
      });
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveType(null);
  };

  const activeCard = activeId && activeType === 'card' 
    ? columns.flatMap(col => col.cards).find(card => card.id === activeId)
    : null;

  const activeColumn = activeId && activeType === 'column'
    ? columns.find(col => col.id === activeId)
    : null;

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex h-full items-start gap-6">
            {columns.map((column) => (
              <SortableColumn 
                key={column.id} 
                column={column} 
                onCardClick={onCardClick}
              />
            ))}
            
            {/* Add List Button */}
            <button className="flex w-80 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-200/70 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors border-2 border-dashed border-slate-300 hover:border-slate-400">
              <span className="material-symbols-outlined">add</span>
              Add another list
            </button>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeCard && (
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl cursor-grabbing rotate-2 w-80">
              {activeCard.image && (
                <div 
                  className="mb-2 w-full aspect-video rounded-md bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url("${activeCard.image}")` }}
                />
              )}
              <p className="text-sm font-medium text-slate-800">{activeCard.title}</p>
              {(activeCard.comments !== undefined || activeCard.attachments !== undefined || activeCard.dueDate !== undefined) && (
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  {activeCard.attachments !== undefined && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">attachment</span>
                      {activeCard.attachments}
                    </span>
                  )}
                  {activeCard.comments !== undefined && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">chat_bubble</span>
                      {activeCard.comments}
                    </span>
                  )}
                  {activeCard.dueDate !== undefined && (
                    <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      activeCard.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                      {activeCard.dueDate}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
          {activeColumn && (
            <div className="flex w-80 shrink-0 flex-col gap-4 rounded-xl bg-slate-100 p-4 shadow-2xl rotate-2 opacity-90">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">drag_indicator</span>
                  {activeColumn.title}
                  <span className="text-sm font-normal text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                    {activeColumn.cards.length}
                  </span>
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {activeColumn.cards.slice(0, 3).map((card) => (
                  <div key={card.id} className="rounded-lg border border-slate-200 bg-white p-3 opacity-70">
                    <p className="text-sm text-slate-800">{card.title}</p>
                  </div>
                ))}
                {activeColumn.cards.length > 3 && (
                  <div className="text-xs text-slate-500 text-center">
                    +{activeColumn.cards.length - 3} more cards
                  </div>
                )}
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}