'use client';

import { useState, useEffect } from 'react';
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
import { createClient } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';

interface Card {
  id: string;
  title: string;
  description?: string;
  image?: string;
  attachments?: number;
  comments?: number;
  dueDate?: string;
  priority?: 'high' | 'medium';
  column_id: string;
  position: number;
}

interface Column {
  id: string;
  title: string;
  position: number;
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
          {card.attachments !== undefined && card.attachments > 0 && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">attachment</span>
              {card.attachments}
            </span>
          )}
          {card.comments !== undefined && card.comments > 0 && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">chat_bubble</span>
              {card.comments}
            </span>
          )}
          {card.dueDate && (
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
  onCardClick,
  onAddCard
}: { 
  column: Column; 
  onCardClick?: (card: Card) => void;
  onAddCard: (columnId: string) => void;
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
      
      <button 
        onClick={() => onAddCard(column.id)}
        className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
      >
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
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'card' | 'column' | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { selectedBoard } = useOrganization();
  const supabase = createClient();

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

  // Load columns and cards from database
  useEffect(() => {
    if (selectedBoard) {
      fetchWorkspaceData();
    }
  }, [selectedBoard, refreshTrigger]);

  const fetchWorkspaceData = async () => {
    if (!selectedBoard) return;

    try {
      setLoading(true);
      
      // Fetch columns
      const { data: columnsData, error: columnsError } = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', selectedBoard.id)
        .order('position');

      if (columnsError) {
        console.error('Error fetching columns:', columnsError);
        throw columnsError;
      }

      // If no columns exist, create default ones
      if (!columnsData || columnsData.length === 0) {
        console.log('No columns found, creating default columns');
        await createDefaultColumns();
        return;
      }

      console.log('Fetched columns:', columnsData);

      // Fetch cards for each column
      const columnsWithCards = await Promise.all(
        columnsData.map(async (column) => {
          const { data: cardsData, error: cardsError } = await supabase
            .from('cards')
            .select('*')
            .eq('column_id', column.id)
            .order('position');

          if (cardsError) {
            console.error(`Error fetching cards for column ${column.id}:`, cardsError);
            throw cardsError;
          }

          const cards: Card[] = (cardsData || []).map(card => ({
            id: card.id,
            title: card.title,
            description: card.description,
            attachments: card.attachments,
            comments: card.comments,
            dueDate: card.due_date,
            priority: card.priority as 'high' | 'medium',
            column_id: card.column_id,
            position: card.position
          }));

          console.log(`Fetched ${cards.length} cards for column ${column.title}`);

          return {
            id: column.id,
            title: column.title,
            position: column.position,
            cards
          };
        })
      );

      setColumns(columnsWithCards);
      console.log('Workspace data loaded successfully');
    } catch (error) {
      console.error('Error fetching workspace data:', error);
      alert('Error loading workspace data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultColumns = async () => {
    if (!selectedBoard) return;

    const defaultColumns = [
      { title: '📋 To Do', position: 0 },
      { title: '⚡ In Progress', position: 1 },
      { title: '👀 In Review', position: 2 },
      { title: '✅ Done', position: 3 }
    ];

    try {
      const { data: newColumns, error } = await supabase
        .from('columns')
        .insert(
          defaultColumns.map(col => ({
            title: col.title,
            board_id: selectedBoard.id,
            position: col.position
          }))
        )
        .select();

      if (error) {
        console.error('Supabase error creating default columns:', error);
        throw error;
      }

      console.log('Default columns created:', newColumns);

      // Set empty columns
      const emptyColumns: Column[] = (newColumns || []).map(col => ({
        id: col.id,
        title: col.title,
        position: col.position,
        cards: []
      }));

      setColumns(emptyColumns);
    } catch (error) {
      console.error('Error creating default columns:', error);
      alert('Error creating default columns. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshWorkspace = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const isColumn = columns.some(col => col.id === active.id);
    setActiveType(isColumn ? 'column' : 'card');
  };

  const handleDragEnd = async (event: DragEndEvent) => {
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
        const newColumns = arrayMove(columns, activeIndex, overIndex);
        
        // Update positions in database
        await updateColumnPositions(newColumns);
        setColumns(newColumns);
      }
      return;
    }

    // Card reordering
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
    const targetColumn = columns.find(col => col.id === overId);
    if (targetColumn) {
      overColumnIndex = columns.findIndex(col => col.id === overId);
      overCardIndex = targetColumn.cards.length;
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

    const activeColumn = columns[activeColumnIndex];
    const targetOverColumn = columns[overColumnIndex];
    const activeCard = activeColumn.cards[activeCardIndex];

    let newColumns: Column[];

    // Same column reordering
    if (activeColumnIndex === overColumnIndex) {
      const newCards = arrayMove(
        activeColumn.cards,
        activeCardIndex,
        overCardIndex
      );

      newColumns = columns.map((col, index) =>
        index === activeColumnIndex
          ? { ...col, cards: newCards }
          : col
      );
    } else {
      // Moving between columns
      newColumns = columns.map((col, index) => {
        if (index === activeColumnIndex) {
          // Remove from active column
          return {
            ...col,
            cards: col.cards.filter(card => card.id !== activeId)
          };
        } else if (index === overColumnIndex) {
          // Add to over column
          const newCard = {
            ...activeCard,
            column_id: targetOverColumn.id
          };
          return {
            ...col,
            cards: [
              ...col.cards.slice(0, overCardIndex),
              newCard,
              ...col.cards.slice(overCardIndex)
            ]
          };
        }
        return col;
      });
    }

    // Update database
    await updateCardPositions(newColumns);
    setColumns(newColumns);
  };

  const updateColumnPositions = async (updatedColumns: Column[]) => {
    try {
      const updates = updatedColumns.map((column, index) => ({
        id: column.id,
        position: index
      }));

      console.log('Updating column positions:', updates);

      const { data, error } = await supabase
        .from('columns')
        .upsert(updates)
        .select();

      if (error) {
        console.error('Supabase error updating column positions:', error);
        throw error;
      }

      console.log('Column positions updated successfully:', data);
    } catch (error) {
      console.error('Error updating column positions:', error);
    }
  };

  const updateCardPositions = async (updatedColumns: Column[]) => {
  try {
    // Filter out mock cards and only update real database cards
    const cardUpdates = updatedColumns.flatMap(column =>
      column.cards
        .filter(card => {
          // Skip cards that are mock data (they start with 'card-' or 'mock-')
          const isMockCard = card.id.startsWith('card-') || card.id.startsWith('mock-');
          if (isMockCard) {
            console.log('Skipping mock card:', card.id);
            return false;
          }
          // Also validate that we have a valid UUID
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(card.id);
          if (!isValidUUID) {
            console.log('Skipping invalid UUID card:', card.id);
            return false;
          }
          return true;
        })
        .map((card, index) => ({
          id: card.id,
          column_id: column.id,
          position: index,
          updated_at: new Date().toISOString() // Add updated_at timestamp
        }))
    );

    console.log('Updating card positions for', cardUpdates.length, 'cards:', cardUpdates);

    if (cardUpdates.length === 0) {
      console.log('No real cards to update positions for');
      return;
    }

    // Test database connection first
    const { data: testData, error: testError } = await supabase
      .from('cards')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Database connection test failed:', testError);
      throw new Error(`Database connection failed: ${testError.message}`);
    }

    console.log('Database connection test successful');

    // Update cards one by one to identify which one fails
    const results = [];
    for (const cardUpdate of cardUpdates) {
      try {
        console.log('Updating card:', cardUpdate);
        
        const { data, error } = await supabase
          .from('cards')
          .update({
            column_id: cardUpdate.column_id,
            position: cardUpdate.position,
            updated_at: cardUpdate.updated_at
          })
          .eq('id', cardUpdate.id)
          .select();

        if (error) {
          console.error(`Failed to update card ${cardUpdate.id}:`, error);
          results.push({ success: false, cardId: cardUpdate.id, error });
        } else {
          console.log(`Successfully updated card ${cardUpdate.id}:`, data);
          results.push({ success: true, cardId: cardUpdate.id, data });
        }
      } catch (cardError) {
        console.error(`Error updating card ${cardUpdate.id}:`, cardError);
        results.push({ success: false, cardId: cardUpdate.id, error: cardError });
      }
    }

    // Check if any updates failed
    const failedUpdates = results.filter(result => !result.success);
    if (failedUpdates.length > 0) {
      console.error('Some card updates failed:', failedUpdates);
      throw new Error(`${failedUpdates.length} card updates failed. Check console for details.`);
    }

    console.log('All card positions updated successfully');
    
    // Refresh workspace to ensure UI is in sync with database
    refreshWorkspace();
    
  } catch (error) {
    console.error('Error updating card positions:', error);
    // Don't show alert for position updates as it can be annoying during drag-and-drop
    console.log('Card position update error (non-critical):', error);
  }
};
  const handleAddCard = async (columnId: string) => {
    if (!selectedBoard) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: newCard, error } = await supabase
        .from('cards')
        .insert([
          {
            title: 'New Task',
            column_id: columnId,
            board_id: selectedBoard.id,
            position: columns.find(col => col.id === columnId)?.cards.length || 0,
            created_by: user.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating card:', error);
        throw error;
      }

      console.log('New card created:', newCard);

      // Update local state
      setColumns(prevColumns =>
        prevColumns.map(column =>
          column.id === columnId
            ? {
                ...column,
                cards: [
                  ...column.cards,
                  {
                    id: newCard.id,
                    title: newCard.title,
                    description: newCard.description,
                    attachments: newCard.attachments,
                    comments: newCard.comments,
                    dueDate: newCard.due_date,
                    priority: newCard.priority as 'high' | 'medium',
                    column_id: newCard.column_id,
                    position: newCard.position
                  }
                ]
              }
            : column
        )
      );
    } catch (error) {
      console.error('Error creating card:', error);
      alert('Error creating card. Please try again.');
    }
  };

  const handleAddColumn = async () => {
    if (!selectedBoard) return;

    try {
      const { data: newColumn, error } = await supabase
        .from('columns')
        .insert([
          {
            title: 'New List',
            board_id: selectedBoard.id,
            position: columns.length
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating column:', error);
        throw error;
      }

      console.log('New column created:', newColumn);

      setColumns(prev => [
        ...prev,
        {
          id: newColumn.id,
          title: newColumn.title,
          position: newColumn.position,
          cards: []
        }
      ]);
    } catch (error) {
      console.error('Error creating column:', error);
      alert('Error creating column. Please try again.');
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-lg">Loading workspace...</div>
      </div>
    );
  }

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
                onAddCard={handleAddCard}
              />
            ))}
            
            {/* Add List Button */}
            <button 
              onClick={handleAddColumn}
              className="flex w-80 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-200/70 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors border-2 border-dashed border-slate-300 hover:border-slate-400"
            >
              <span className="material-symbols-outlined">add</span>
              Add another list
            </button>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeCard && (
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl cursor-grabbing rotate-2 w-80">
              <p className="text-sm font-medium text-slate-800">{activeCard.title}</p>
              {(activeCard.comments !== undefined || activeCard.attachments !== undefined || activeCard.dueDate !== undefined) && (
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  {activeCard.attachments !== undefined && activeCard.attachments > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">attachment</span>
                      {activeCard.attachments}
                    </span>
                  )}
                  {activeCard.comments !== undefined && activeCard.comments > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">chat_bubble</span>
                      {activeCard.comments}
                    </span>
                  )}
                  {activeCard.dueDate && (
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