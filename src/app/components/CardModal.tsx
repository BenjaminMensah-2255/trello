'use client';

import { useState, useEffect } from 'react';

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
  column_id?: string;
  position?: number;
}

interface CardModalProps {
  card: Card;
  onClose: () => void;
  onSave: (card: Card) => void;
}

export default function CardModal({ card, onClose, onSave }: CardModalProps) {
  const [editedCard, setEditedCard] = useState<Card>(card);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update local state when card prop changes
  useEffect(() => {
    console.log('CardModal received card:', card);
    setEditedCard(card);
  }, [card]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit button clicked');
    console.log('Edited card data:', editedCard);
    
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!editedCard.title.trim()) {
        console.error('Title is required');
        alert('Title is required');
        return;
      }
      
      console.log('Calling onSave with:', editedCard);
      await onSave(editedCard);
      console.log('onSave completed successfully');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    console.log('Overlay clicked');
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const handleInputChange = (field: keyof Card, value: any) => {
    console.log(`Field ${field} changed to:`, value);
    setEditedCard(prev => ({
      ...prev,
      [field]: value
    }));
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
            type="button"
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
            <label htmlFor="card-title" className="block text-sm font-medium text-slate-700 mb-2">
              Title *
            </label>
            <input
              id="card-title"
              type="text"
              value={editedCard.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter card title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="card-description" className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="card-description"
              value={editedCard.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Add a detailed description..."
            />
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="card-due-date" className="block text-sm font-medium text-slate-700 mb-2">
              Due Date
            </label>
            <input
              id="card-due-date"
              type="date"
              value={formatDateForInput(editedCard.dueDate)}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="card-priority" className="block text-sm font-medium text-slate-700 mb-2">
              Priority
            </label>
            <select
              id="card-priority"
              value={editedCard.priority || ''}
              onChange={(e) => handleInputChange('priority', e.target.value)}
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

          {/* Debug Info (remove in production) */}
          <div className="p-4 bg-slate-100 rounded-lg text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>Card ID: {editedCard.id}</p>
            <p>Title: {editedCard.title}</p>
            <p>Submitting: {isSubmitting ? 'Yes' : 'No'}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !editedCard.title.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}