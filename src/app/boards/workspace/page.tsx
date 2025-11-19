'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganization } from '../../contexts/OrganizationContext';
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
  dueDate?: string;
  priority?: 'high' | 'medium';
  assignee?: string;
  assignees?: string[];
  column_id?: string;
  position?: number;
}

export default function WorkspacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedOrganization, selectedBoard } = useOrganization();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Redirect if no board is selected
    if (!selectedBoard || !selectedOrganization) {
      router.push('/boards');
      return;
    }
  }, [selectedBoard, selectedOrganization, router]);

  const handleCardClick = (card: Card) => {
    console.log('Workspace: Card clicked:', card);
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Workspace: Closing modal');
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleSaveCard = async (updatedCard: Card) => {
    console.log('Workspace: Saving card:', updatedCard);
    
    try {
      // Prepare the data for Supabase
      const cardData = {
        title: updatedCard.title,
        description: updatedCard.description || null,
        due_date: updatedCard.dueDate || null,
        priority: updatedCard.priority || 'medium',
        attachments: updatedCard.attachments || 0,
        comments: updatedCard.comments || 0,
        updated_at: new Date().toISOString()
      };

      console.log('Workspace: Updating card with data:', cardData);

      const { data, error } = await supabase
        .from('cards')
        .update(cardData)
        .eq('id', updatedCard.id)
        .select();

      if (error) {
        console.error('Workspace: Supabase error:', error);
        throw error;
      }

      console.log('Workspace: Card saved successfully:', data);
      
      // Close modal after successful save
      setIsModalOpen(false);
      setSelectedCard(null);

      // You might want to refresh the workspace data here
      // or update the local state to reflect changes
      // For now, let's just show a success message
      alert('Card saved successfully!');

    } catch (error) {
      console.error('Workspace: Error saving card:', error);
      alert('Error saving card. Please check console for details.');
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
              <div className="-ml-3 h-10 w-10 overflow-visible">
                <div 
                  className="h-full w-full rounded-full border-2 border-white bg-cover bg-center shadow-sm"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBebaIDpo4Ll_v-119E3GPalCL9GItmbPFsqC6H_bY8-30aNTq2YuusjV1lAbQSJftiZS2W-OabNktxE38aUoe_zBQ4tOObJyhuA0HCctd3A1FrhCes0xbNEhQDJrrSKE1sNJDwpGwHImyqEewLHza5BtECClG_v56a_eNBgxA9eC3f5GCTe60bpHU1wi2sAyYoQ8TnHi5sN4yemAPlv3qybAcCm_lr_ISRTMj3CZ4Uf_Flblgi68FQHJH1y1Y-UG4_SmOGjGXVdedu")'
                  }}
                />
              </div>
              <div className="-ml-3 h-10 w-10 overflow-visible">
                <div 
                  className="h-full w-full rounded-full border-2 border-white bg-cover bg-center shadow-sm"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCKe3xK5Tyth5TX1n2GW9J3V0kEiymzrlcQjeM4dEtIWBiCYlbrOFFOIYHg4IUPL59Sv50aFL6ENc6gTVUnD1iCxgKGDF0nQGRyMgWKNFaLXNTUv-J9NRK_yNGH2mr-q2-VukHPPx_WLsOGkKHF1C8LYhg2_kDxor1DTz0CP7wWEXZIDPfkVq2YmFbyQBBWa2W7TkaAfFdjf22XhrLiqvqmzGn8tvMlrC_syrtdGKIk_AelADSa2sRlB0DNYyhPwA8XZpFD6uMsn2BD")'
                  }}
                />
              </div>
              <div className="-ml-3 h-10 w-10 overflow-visible">
                <div 
                  className="h-full w-full rounded-full border-2 border-white bg-cover bg-center shadow-sm"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPvXmbDbyHTPo3REQUf_oGJWGX9_nYwSz21a1mXhayeAlF07pl5ga0hRtNYYmKFvKbqhciKEwMYDAkcwAy1IVvLdI0igqCabF9Eyebmc_uDLGfSl_ty9l4mkI5EimAqB2wo_TX_SRZuNkdTvjgR_wmUadH0Oj4IbkMGZetkokTOxi7gBHg_7CGwfg6PXpfMmBIY6KPz9BZddneVNY8H-VLD1oCALs3jTdlMcITQ9cg1LU7nQgnO1sUKN9Y3SHHBDKkB-NJCUedzRLb")'
                  }}
                />
              </div>
              <div className="-ml-3 h-10 w-10 overflow-visible">
                <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-white bg-slate-200 text-sm font-semibold text-slate-600 shadow-sm">
                  +5
                </div>
              </div>
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
      <AdvancedDraggableWorkspace onCardClick={handleCardClick} />

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