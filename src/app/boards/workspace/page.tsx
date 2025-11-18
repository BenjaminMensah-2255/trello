'use client';

import { useState } from 'react';
import AdvancedDraggableWorkspace from '../../components/AdvancedDraggableWorkspace';
import CardModal from '../../components/CardModal';

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
}

export default function WorkspacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleSaveCard = (updatedCard: Card) => {
    // Here you would update the card in your state/backend
    console.log('Saving card:', updatedCard);
    // For now, we'll just close the modal
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background-light">
      {/* Header */}
      <header className="flex h-auto shrink-0 flex-col gap-4 border-b border-slate-200 p-6">
        {/* Page Heading */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.03em] text-slate-900">
              Q4 Marketing Campaign
            </h1>
            <p className="text-base font-normal leading-normal text-slate-500">
              Manage all marketing tasks for the final quarter.
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
      </header>

      {/* Advanced Draggable Workspace - FIXED: added onCardClick prop */}
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