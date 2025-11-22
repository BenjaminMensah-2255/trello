'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useAuth } from '../../contexts/AuthContext';
import { createClient } from '../../lib/supabase';
import AdvancedDraggableWorkspace from '../../components/AdvancedDraggableWorkspace';
import CardModal from '../../components/CardModal';

// Use the same Card interface as in CardModal
interface Card {
  id: string;
  title: string;
  description?: string;
  image?: string;
  attachments?: number;
  comments?: number;
  due_date?: string;
  priority?: 'high' | 'medium' | 'low';
  assignee?: string;
  assignees?: string[];
  list_id: string;
  position: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export default function WorkspacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardMembers, setBoardMembers] = useState<any[]>([]);
  const { selectedOrganization, selectedBoard } = useOrganization();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  useEffect(() => {
    if (selectedBoard && selectedOrganization) {
      fetchBoardMembers();
    }
  }, [selectedBoard, selectedOrganization]);

  useEffect(() => {
    // Redirect if no board is selected
    if (!selectedBoard || !selectedOrganization) {
      router.push('/boards');
      return;
    }
  }, [selectedBoard, selectedOrganization, router]);

  const fetchBoardMembers = async () => {
    if (!selectedOrganization || !selectedBoard) return;

    try {
      // Fetch organization members who have access to this board
      const { data: membersData, error } = await supabase
        .from('organization_members')
        .select(`
          role,
          profiles:user_id (
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('organization_id', selectedOrganization.id)
        .limit(5); // Limit for the avatar display

      if (error) throw error;

      const transformedMembers = (membersData || [])
        .filter(member => member.profiles && member.profiles[0])
        .map(member => ({
          id: member.profiles[0].id,
          name: member.profiles[0].full_name || member.profiles[0].email.split('@')[0],
          email: member.profiles[0].email,
          avatar_url: member.profiles[0].avatar_url,
          role: member.role
        }));

      setBoardMembers(transformedMembers);
    } catch (error) {
      console.error('Error fetching board members:', error);
    }
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleSaveCard = async (updatedCard: Card) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Update card in database
      const { error } = await supabase
        .from('cards')
        .update({
          title: updatedCard.title,
          description: updatedCard.description,
          image: updatedCard.image,
          due_date: updatedCard.due_date,
          priority: updatedCard.priority,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedCard.id);

      if (error) throw error;

      console.log('Card saved successfully:', updatedCard);
      
      // Close modal after successful save
      setIsModalOpen(false);
      setSelectedCard(null);

      // Show success message
      alert('Card saved successfully!');

    } catch (error) {
      console.error('Error saving card:', error);
      alert('Error saving card. Please try again.');
    }
  };

  // If no board is selected, show loading or redirect
  if (!selectedBoard || !selectedOrganization) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading workspace...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background-light">
      {/* Header */}
      <header className="flex h-auto shrink-0 flex-col gap-4 border-b border-slate-200 p-6">
        {/* Page Heading */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.03em] text-slate-900">
              {selectedBoard.title}
            </h1>
            <p className="text-base font-normal leading-normal text-slate-500">
              {selectedOrganization.name} • Manage all tasks and workflows
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Avatar Group */}
            <div className="flex items-center">
              {boardMembers.slice(0, 3).map((member, index) => (
                <div key={member.id} className={`h-10 w-10 overflow-visible ${index > 0 ? '-ml-3' : ''}`}>
                  <div 
                    className="h-full w-full rounded-full border-2 border-white bg-cover bg-center shadow-sm"
                    style={{
                      backgroundImage: member.avatar_url ? `url("${member.avatar_url}")` : 'none',
                      backgroundColor: !member.avatar_url ? '#e2e8f0' : undefined
                    }}
                  >
                    {!member.avatar_url && (
                      <div className="w-full h-full rounded-full flex items-center justify-center text-slate-600 font-medium text-sm">
                        {member.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {boardMembers.length > 3 && (
                <div className="-ml-3 h-10 w-10 overflow-visible">
                  <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-white bg-slate-200 text-sm font-semibold text-slate-600 shadow-sm">
                    +{boardMembers.length - 3}
                  </div>
                </div>
              )}
            </div>
            
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined">person_add</span>
              <span className="truncate">Share</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <label className="flex h-10 w-full min-w-40 flex-col">
              <div className="flex h-full w-full flex-1 items-stretch rounded-lg bg-white border border-slate-300 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
                <div className="flex items-center justify-center rounded-l-lg bg-slate-50 pl-3 text-slate-500 border-r border-slate-300">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg bg-white px-3 text-sm font-normal leading-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 border-none"
                  placeholder="Search cards, lists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </label>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <button className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium leading-normal text-slate-700 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
              <span>Filter</span>
            </button>
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined">sort</span>
            </button>
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined">visibility</span>
            </button>
          </div>

          {/* New Task Button */}
          <button className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="truncate">New Task</span>
          </button>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button 
            onClick={() => router.push('/dashboard')}
            className="hover:text-slate-700 transition-colors"
          >
            Organizations
          </button>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <button 
            onClick={() => router.push('/boards')}
            className="hover:text-slate-700 transition-colors"
          >
            {selectedOrganization.name}
          </button>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-slate-700 font-medium">{selectedBoard.title}</span>
        </div>
      </header>

      {/* Advanced Draggable Workspace */}
      <AdvancedDraggableWorkspace 
        boardId={selectedBoard.id} 
        onCardClick={handleCardClick} 
      />

      {/* Card Modal */}
      {isModalOpen && selectedCard && (
        <CardModal 
          card={selectedCard}
          onClose={handleCloseModal}
          onSave={handleSaveCard}
        />
      )}
    </div>
  );
}