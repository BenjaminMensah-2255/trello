'use client';

import { useState } from 'react';

export interface Card {
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

interface CardModalProps {
  card: Card;
  onClose: () => void;
  onSave: (card: Card) => void;
}

export default function CardModal({ card, onClose, onSave }: CardModalProps) {
  const [editedCard, setEditedCard] = useState<Card>(card);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedCard);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Card Details</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Card Image */}
          {editedCard.image && (
            <div 
              className="w-full aspect-video rounded-lg bg-cover bg-center bg-no-repeat mb-4 border border-slate-200"
              style={{ backgroundImage: `url("${editedCard.image}")` }}
            />
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={editedCard.title}
              onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter card title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={editedCard.description || ''}
              onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Add a detailed description..."
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={editedCard.dueDate || ''}
              onChange={(e) => setEditedCard({ ...editedCard, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Priority
            </label>
            <select
              value={editedCard.priority || ''}
              onChange={(e) => setEditedCard({ ...editedCard, priority: e.target.value as 'high' | 'medium' })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">No priority</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Card Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
            {editedCard.attachments !== undefined && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">attachment</span>
                <span>{editedCard.attachments} attachments</span>
              </div>
            )}
            {editedCard.comments !== undefined && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">chat_bubble</span>
                <span>{editedCard.comments} comments</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}