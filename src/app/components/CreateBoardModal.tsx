'use client';

import { useState } from 'react';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (boardTitle: string) => void;
}

export default function CreateBoardModal({ 
  isOpen, 
  onClose, 
  onCreate 
}: CreateBoardModalProps) {
  const [boardTitle, setBoardTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardTitle.trim()) {
      onCreate(boardTitle.trim());
      setBoardTitle('');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setBoardTitle('');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-soft border border-border-light">
        {/* Close Icon Button */}
        <button 
          onClick={() => {
            onClose();
            setBoardTitle('');
          }}
          className="absolute top-4 right-4 text-text-secondary-light hover:text-text-light transition-colors z-10"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex flex-col p-8">
          {/* Headline */}
          <h2 className="text-xl font-semibold leading-tight text-text-light">
            Create a new board
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {/* Board Title Field */}
            <label className="flex w-full flex-col">
              <p className="text-sm font-medium leading-normal text-text-light pb-2">
                Board Title
              </p>
              <input 
                className="flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light bg-white p-3 text-base font-normal leading-normal text-text-light placeholder:text-text-secondary-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g., Q4 Marketing Campaign, Website Redesign"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                autoFocus
              />
            </label>

            <div className="mt-6">
              {/* Create Button */}
              <button
                type="submit"
                disabled={!boardTitle.trim()}
                className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-semibold leading-normal text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              >
                <span className="truncate">Create Board</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}