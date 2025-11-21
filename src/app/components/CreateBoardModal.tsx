'use client';

import { useState } from 'react';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (boardTitle: string) => Promise<void>; // Changed to Promise
}

export default function CreateBoardModal({ 
  isOpen, 
  onClose, 
  onCreate 
}: CreateBoardModalProps) {
  const [boardTitle, setBoardTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardTitle.trim()) return;

    setLoading(true);
    setError('');

    try {
      await onCreate(boardTitle.trim());
      setBoardTitle('');
      onClose();
    } catch (err: any) {
      console.error('Error in CreateBoardModal:', err);
      setError(err.message || 'Failed to create board. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while loading
    
    onClose();
    setBoardTitle('');
    setError('');
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardTitle(e.target.value);
    // Clear error when user starts typing
    if (error) setError('');
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
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 text-text-secondary-light hover:text-text-light transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex flex-col p-8">
          {/* Headline */}
          <h2 className="text-xl font-semibold leading-tight text-text-light">
            Create a new board
          </h2>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {/* Board Title Field */}
            <label className="flex w-full flex-col">
              <p className="text-sm font-medium leading-normal text-text-light pb-2">
                Board Title
              </p>
              <input 
                className={`flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border bg-white p-3 text-base font-normal leading-normal placeholder:text-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  error 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-border-light focus:border-primary'
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                placeholder="e.g., Q4 Marketing Campaign, Website Redesign"
                value={boardTitle}
                onChange={handleInputChange}
                autoFocus
                disabled={loading}
                maxLength={100}
              />
              <p className="text-xs text-text-secondary-light mt-1">
                {boardTitle.length}/100 characters
              </p>
            </label>

            <div className="mt-6">
              {/* Create Button */}
              <button
                type="submit"
                disabled={!boardTitle.trim() || loading}
                className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-semibold leading-normal text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  <span className="truncate">Create Board</span>
                )}
              </button>
            </div>
          </form>

          {/* Tips Section */}
          <div className="mt-6 pt-6 border-t border-border-light">
            <h3 className="text-sm font-medium text-text-light mb-2">Tips for great board titles:</h3>
            <ul className="text-xs text-text-secondary-light space-y-1">
              <li>• Be specific about the project or goal</li>
              <li>• Include timeframe if relevant (Q4, 2024, etc.)</li>
              <li>• Keep it concise and clear</li>
              <li>• Use team names if it's a collaborative board</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}