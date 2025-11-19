'use client';

import { useState, useEffect } from 'react';

interface Organization {
  id: string;
  name: string;
  projectCount: number;
  imageUrl: string;
  altText: string;
}

interface EditOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (organizationId: string, organizationName: string) => void;
  onDelete: (organizationId: string) => void;
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

  useEffect(() => {
    if (organization) {
      setOrganizationName(organization.name);
    }
  }, [organization]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (organizationName.trim() && organization) {
      onUpdate(organization.id, organizationName.trim());
      setOrganizationName('');
      onClose();
    }
  };

  const handleDelete = () => {
    if (organization) {
      onDelete(organization.id);
      setIsDeleteConfirm(false);
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setOrganizationName('');
      setIsDeleteConfirm(false);
    }
  };

  const handleClose = () => {
    onClose();
    setOrganizationName('');
    setIsDeleteConfirm(false);
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
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex flex-col p-8">
          {/* Headline */}
          <h2 className="text-xl font-semibold leading-tight text-text-light">
            {isDeleteConfirm ? 'Delete Organization' : 'Edit Organization'}
          </h2>

          {!isDeleteConfirm ? (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              {/* Organization Name Field */}
              <label className="flex w-full flex-col">
                <p className="text-sm font-medium leading-normal text-text-light pb-2">
                  Organization Name
                </p>
                <input 
                  className="flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light bg-white p-3 text-base font-normal leading-normal text-text-light placeholder:text-text-secondary-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Acme Inc."
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  autoFocus
                />
              </label>

              <div className="mt-6 flex gap-3">
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirm(true)}
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-red-500 bg-white px-5 text-base font-semibold leading-normal text-red-500 transition-all hover:bg-red-50"
                >
                  <span className="truncate">Delete</span>
                </button>
                
                {/* Update Button */}
                <button
                  type="submit"
                  disabled={!organizationName.trim() || organizationName === organization.name}
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-semibold leading-normal text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                >
                  <span className="truncate">Update</span>
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
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border-light bg-white px-5 text-base font-semibold leading-normal text-text-light transition-all hover:bg-gray-50"
                >
                  <span className="truncate">Cancel</span>
                </button>
                
                {/* Confirm Delete Button */}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-red-600 px-5 text-base font-semibold leading-normal text-white transition-all hover:bg-red-700"
                >
                  <span className="truncate">Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}