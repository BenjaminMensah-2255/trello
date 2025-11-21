// components/EditOrganizationModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Organization } from '../types/organization';

interface EditOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (organizationId: string, organizationName: string) => Promise<void>;
  onDelete: (organizationId: string) => Promise<void>;
  organization: Organization | null;
}

export default function EditOrganizationModal({ 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete,
  organization 
}: EditOrganizationModalProps) {
  const [organizationName, setOrganizationName] = useState('');
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (organization) {
      setOrganizationName(organization.name);
    }
    setError('');
  }, [organization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationName.trim() || !organization) return;

    setLoading(true);
    setError('');

    try {
      await onUpdate(organization.id, organizationName.trim());
      setOrganizationName('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update organization');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!organization) return;

    setLoading(true);
    setError('');

    try {
      await onDelete(organization.id);
      setIsDeleteConfirm(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete organization');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setOrganizationName('');
    setIsDeleteConfirm(false);
    setError('');
    setLoading(false);
  };

  if (!isOpen || !organization) return null;

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
          className="absolute top-4 right-4 text-text-secondary-light hover:text-text-light transition-colors z-10"
          disabled={loading}
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex flex-col p-8">
          {/* Headline */}
          <h2 className="text-xl font-semibold leading-tight text-text-light">
            {isDeleteConfirm ? 'Delete Organization' : 'Edit Organization'}
          </h2>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!isDeleteConfirm ? (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              {/* Organization Name Field */}
              <label className="flex w-full flex-col">
                <p className="text-sm font-medium leading-normal text-text-light pb-2">
                  Organization Name
                </p>
                <input 
                  className="flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light bg-white p-3 text-base font-normal leading-normal text-text-light placeholder:text-text-secondary-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Acme Inc."
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  autoFocus
                  disabled={loading}
                />
              </label>

              <div className="mt-6 flex gap-3">
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirm(true)}
                  disabled={loading}
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-red-500 bg-white px-5 text-base font-semibold leading-normal text-red-500 transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="truncate">Delete</span>
                </button>
                
                {/* Update Button */}
                <button
                  type="submit"
                  disabled={!organizationName.trim() || organizationName === organization.name || loading}
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-semibold leading-normal text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              {/* Delete Confirmation */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium">
                  Are you sure you want to delete "{organization.name}"?
                </p>
                <p className="text-red-600 text-xs mt-1">
                  This action cannot be undone. All boards and data in this organization will be permanently deleted.
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirm(false)}
                  disabled={loading}
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border-light bg-white px-5 text-base font-semibold leading-normal text-text-light transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="truncate">Cancel</span>
                </button>
                
                {/* Confirm Delete Button */}
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-red-600 px-5 text-base font-semibold leading-normal text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}