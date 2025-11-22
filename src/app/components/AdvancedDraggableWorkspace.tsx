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

interface Card {
  id: string;
  title: string;
  description?: string;
  image?: string;
  due_date?: string;
  priority?: 'high' | 'medium' | 'low';
  list_id: string;
  position: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Computed fields for UI
  attachments_count?: number;
  comments_count?: number;
}

interface List {
  id: string;
  title: string;
  position: number;
  board_id: string;
  created_at: string;
  updated_at: string;
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
      
      {(card.comments_count !== undefined || card.attachments_count !== undefined || card.due_date !== undefined) && (
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          {card.attachments_count !== undefined && card.attachments_count > 0 && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">attachment</span>
              {card.attachments_count}
            </span>
          )}
          {card.comments_count !== undefined && card.comments_count > 0 && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">chat_bubble</span>
              {card.comments_count}
            </span>
          )}
          {card.due_date && (
            <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              card.priority === 'high' ? 'bg-red-100 text-red-700' : 
              card.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <span className="material-symbols-outlined text-[12px]">calendar_today</span>
              {new Date(card.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Sortable List Component
function SortableList({ 
  list, 
  onCardClick,
  onAddCard
}: { 
  list: List; 
  onCardClick?: (card: Card) => void;
  onAddCard: (listId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

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
          {list.title}
          <span className="text-sm font-normal text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
            {list.cards.length}
          </span>
        </h2>
        <button className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-200 transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
      
      <SortableContext items={list.cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[100px]">
          {list.cards.map((card) => (
            <SortableCard key={card.id} card={card} onClick={onCardClick} />
          ))}
        </div>
      </SortableContext>
      
      <button 
        onClick={() => onAddCard(list.id)}
        className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
      >
        <span className="material-symbols-outlined">add</span>
        Add a card
      </button>
    </div>
  );
}

interface AdvancedDraggableWorkspaceProps {
  boardId: string;
  onCardClick?: (card: Card) => void;
}

export default function AdvancedDraggableWorkspace({ boardId, onCardClick }: AdvancedDraggableWorkspaceProps) {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'card' | 'list' | null>(null);
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

  // Load workspace data from database
  useEffect(() => {
    if (boardId) {
      fetchWorkspaceData();
    }
  }, [boardId]);

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);
      
      // Fetch lists for this board
      const { data: listsData, error: listsError } = await supabase
        .from('lists')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true });

      if (listsError) throw listsError;

      if (!listsData || listsData.length === 0) {
        // Create default lists if none exist
        await createDefaultLists();
        return;
      }

      // Fetch cards for each list
      const listsWithCards = await Promise.all(
        listsData.map(async (list) => {
          const { data: cardsData, error: cardsError } = await supabase
            .from('cards')
            .select('*')
            .eq('list_id', list.id)
            .order('position', { ascending: true });

          if (cardsError) throw cardsError;

          // Fetch counts for attachments and comments
          const cardsWithCounts = await Promise.all(
            (cardsData || []).map(async (card) => {
              const { data: attachmentsData } = await supabase
                .from('card_attachments')
                .select('id', { count: 'exact' })
                .eq('card_id', card.id);

              const { data: commentsData } = await supabase
                .from('card_comments')
                .select('id', { count: 'exact' })
                .eq('card_id', card.id);

              return {
                ...card,
                attachments_count: attachmentsData?.length || 0,
                comments_count: commentsData?.length || 0
              };
            })
          );

          return {
            ...list,
            cards: cardsWithCounts
          };
        })
      );

      setLists(listsWithCards);
    } catch (error) {
      console.error('Error fetching workspace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultLists = async () => {
    try {
      const defaultLists = [
        { title: '📋 To Do', position: 0 },
        { title: '⚡ In Progress', position: 1 },
        { title: '👀 In Review', position: 2 },
        { title: '✅ Done', position: 3 }
      ];

      const { data: newLists, error } = await supabase
        .from('lists')
        .insert(
          defaultLists.map(list => ({
            ...list,
            board_id: boardId
          }))
        )
        .select();

      if (error) throw error;

      const listsWithEmptyCards = (newLists || []).map(list => ({
        ...list,
        cards: []
      }));

      setLists(listsWithEmptyCards);
    } catch (error) {
      console.error('Error creating default lists:', error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const isList = lists.some(list => list.id === active.id);
    setActiveType(isList ? 'list' : 'card');
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // List reordering
    if (activeType === 'list') {
      const activeIndex = lists.findIndex(list => list.id === activeId);
      const overIndex = lists.findIndex(list => list.id === overId);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const newLists = arrayMove(lists, activeIndex, overIndex);
        
        // Update positions in database
        await updateListPositions(newLists);
        setLists(newLists);
      }
      return;
    }

    // Card reordering
    let activeListIndex = -1;
    let activeCardIndex = -1;
    let overListIndex = -1;
    let overCardIndex = -1;

    // Find active card position
    lists.forEach((list, listIndex) => {
      list.cards.forEach((card, cardIndex) => {
        if (card.id === activeId) {
          activeListIndex = listIndex;
          activeCardIndex = cardIndex;
        }
      });
    });

    // Check if dropping on a list
    const targetList = lists.find(list => list.id === overId);
    if (targetList) {
      overListIndex = lists.findIndex(list => list.id === overId);
      overCardIndex = targetList.cards.length;
    } else {
      // Find over card position
      lists.forEach((list, listIndex) => {
        list.cards.forEach((card, cardIndex) => {
          if (card.id === overId) {
            overListIndex = listIndex;
            overCardIndex = cardIndex;
          }
        });
      });
    }

    if (activeListIndex === -1 || overListIndex === -1) return;

    const activeList = lists[activeListIndex];
    const targetOverList = lists[overListIndex];
    const activeCard = activeList.cards[activeCardIndex];

    let newLists: List[];

    // Same list reordering
    if (activeListIndex === overListIndex) {
      const newCards = arrayMove(
        activeList.cards,
        activeCardIndex,
        overCardIndex
      );

      newLists = lists.map((list, index) =>
        index === activeListIndex
          ? { ...list, cards: newCards }
          : list
      );

      // Update card positions in database
      await updateCardPositions(newCards, activeList.id);
    } else {
      // Moving between lists
      newLists = lists.map((list, index) => {
        if (index === activeListIndex) {
          // Remove from active list
          return {
            ...list,
            cards: list.cards.filter(card => card.id !== activeId)
          };
        } else if (index === overListIndex) {
          // Add to over list
          const newCard = {
            ...activeCard,
            list_id: targetOverList.id
          };
          const newCards = [
            ...list.cards.slice(0, overCardIndex),
            newCard,
            ...list.cards.slice(overCardIndex)
          ];
          
          // Update card in database
          updateCardList(newCard.id, targetOverList.id, overCardIndex);
          
          return {
            ...list,
            cards: newCards
          };
        }
        return list;
      });
    }

    setLists(newLists);
  };

  const updateListPositions = async (updatedLists: List[]) => {
    try {
      const updates = updatedLists.map((list, index) => ({
        id: list.id,
        position: index,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('lists')
        .upsert(updates);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating list positions:', error);
    }
  };

  const updateCardPositions = async (cards: Card[], listId: string) => {
    try {
      const updates = cards.map((card, index) => ({
        id: card.id,
        position: index,
        list_id: listId,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('cards')
        .upsert(updates);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating card positions:', error);
    }
  };

  const updateCardList = async (cardId: string, newListId: string, newPosition: number) => {
    try {
      const { error } = await supabase
        .from('cards')
        .update({
          list_id: newListId,
          position: newPosition,
          updated_at: new Date().toISOString()
        })
        .eq('id', cardId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating card list:', error);
    }
  };

  const handleAddCard = async (listId: string) => {
    try {
      const list = lists.find(l => l.id === listId);
      if (!list) return;

      // Create card in database
      const { data: newCard, error } = await supabase
        .from('cards')
        .insert({
          title: 'New Task',
          list_id: listId,
          position: list.cards.length,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setLists(prevLists =>
        prevLists.map(l =>
          l.id === listId
            ? {
                ...l,
                cards: [...l.cards, { ...newCard, attachments_count: 0, comments_count: 0 }]
              }
            : l
        )
      );
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const handleAddList = async () => {
    try {
      // Create list in database
      const { data: newList, error } = await supabase
        .from('lists')
        .insert({
          title: 'New List',
          board_id: boardId,
          position: lists.length
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setLists(prev => [...prev, { ...newList, cards: [] }]);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveType(null);
  };

  const activeCard = activeId && activeType === 'card' 
    ? lists.flatMap(list => list.cards).find(card => card.id === activeId)
    : null;

  const activeList = activeId && activeType === 'list'
    ? lists.find(list => list.id === activeId)
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
        <SortableContext items={lists.map(list => list.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex h-full items-start gap-6">
            {lists.map((list) => (
              <SortableList 
                key={list.id} 
                list={list} 
                onCardClick={onCardClick}
                onAddCard={handleAddCard}
              />
            ))}
            
            {/* Add List Button */}
            <button 
              onClick={handleAddList}
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
              {(activeCard.comments_count !== undefined || activeCard.attachments_count !== undefined || activeCard.due_date !== undefined) && (
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  {activeCard.attachments_count !== undefined && activeCard.attachments_count > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">attachment</span>
                      {activeCard.attachments_count}
                    </span>
                  )}
                  {activeCard.comments_count !== undefined && activeCard.comments_count > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">chat_bubble</span>
                      {activeCard.comments_count}
                    </span>
                  )}
                  {activeCard.due_date && (
                    <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      activeCard.priority === 'high' ? 'bg-red-100 text-red-700' : 
                      activeCard.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                      {new Date(activeCard.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
          {activeList && (
            <div className="flex w-80 shrink-0 flex-col gap-4 rounded-xl bg-slate-100 p-4 shadow-2xl rotate-2 opacity-90">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">drag_indicator</span>
                  {activeList.title}
                  <span className="text-sm font-normal text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                    {activeList.cards.length}
                  </span>
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {activeList.cards.slice(0, 3).map((card) => (
                  <div key={card.id} className="rounded-lg border border-slate-200 bg-white p-3 opacity-70">
                    <p className="text-sm text-slate-800">{card.title}</p>
                  </div>
                ))}
                {activeList.cards.length > 3 && (
                  <div className="text-xs text-slate-500 text-center">
                    +{activeList.cards.length - 3} more cards
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