'use client';

import { useState } from 'react';

export default function InvitesPage() {
  const [emailInput, setEmailInput] = useState('');
  const [pendingInvitations, setPendingInvitations] = useState([
    {
      id: '1',
      email: 'sara.connor@email.com',
      status: 'pending',
      initial: 'S'
    },
    {
      id: '2',
      email: 'john.doe@email.com',
      status: 'pending',
      initial: 'J'
    },
    {
      id: '3',
      email: 'kyle.reese@email.com',
      status: 'expired',
      initial: 'K'
    }
  ]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const emails = emailInput.split(',').map(email => email.trim()).filter(email => email);
    
    emails.forEach(email => {
      const newInvitation = {
        id: Date.now().toString(),
        email,
        status: 'pending' as const,
        initial: email.charAt(0).toUpperCase()
      };
      setPendingInvitations(prev => [newInvitation, ...prev]);
    });

    setEmailInput('');
  };

  const handleResend = (invitationId: string) => {
    // Handle resend logic here
    console.log('Resending invitation:', invitationId);
  };

  const handleDelete = (invitationId: string) => {
    setPendingInvitations(prev => prev.filter(invite => invite.id !== invitationId));
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          dotColor: 'bg-yellow-500',
          darkBgColor: 'dark:bg-yellow-900/50',
          darkTextColor: 'dark:text-yellow-300',
          label: 'Pending'
        };
      case 'expired':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          dotColor: 'bg-red-500',
          darkBgColor: 'dark:bg-red-900/50',
          darkTextColor: 'dark:text-red-300',
          label: 'Expired'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          dotColor: 'bg-gray-500',
          darkBgColor: 'dark:bg-gray-900/50',
          darkTextColor: 'dark:text-gray-300',
          label: 'Unknown'
        };
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      {/* Page Heading */}
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-3xl font-black tracking-tighter text-text-light-primary">Invite Members</h1>
      </div>

      {/* Invitation Card */}
      <div className="rounded-xl border border-border-light bg-card-light p-6 shadow-soft">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold leading-tight text-text-light-primary">Invite a new member</p>
            <p className="text-sm font-normal leading-normal text-text-secondary-light">
              Enter one or more email addresses separated by commas to invite them to your organization.
            </p>
          </div>
          
          <form onSubmit={handleSendInvite} className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            {/* Email Input */}
            <label className="flex w-full flex-col">
              <span className="mb-1.5 text-sm font-medium text-text-light-primary">Email address(es)</span>
              <input 
                className="w-full min-w-0 flex-1 rounded-lg border border-border-light bg-background-light px-4 py-2.5 text-sm text-text-light-primary placeholder:text-text-secondary-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="name@example.com, another@example.com"
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </label>
            
            {/* Send Invite Button */}
            <button 
              type="submit"
              disabled={!emailInput.trim()}
              className="flex h-10 min-w-[84px] max-w-[480px] shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold tracking-wide text-white shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span className="truncate">Send Invite</span>
            </button>
          </form>
        </div>
      </div>

      {/* Pending Invitations List */}
      {pendingInvitations.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-text-light-primary">
            Pending Invitations ({pendingInvitations.length})
          </h2>
          
          <div className="flex flex-col gap-3">
            {pendingInvitations.map((invitation) => {
              const statusConfig = getStatusConfig(invitation.status);
              
              return (
                <div key={invitation.id} className="flex items-center gap-4 rounded-lg border border-border-light bg-card-light p-4 shadow-soft">
                  {/* Avatar */}
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">
                    {invitation.initial}
                  </div>
                  
                  {/* Email */}
                  <div className="flex-grow text-sm font-medium text-text-light-primary">
                    {invitation.email}
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`hidden items-center gap-2 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.darkBgColor} ${statusConfig.darkTextColor} px-2.5 py-0.5 text-xs font-semibold sm:flex`}>
                    <div className={`size-1.5 rounded-full ${statusConfig.dotColor}`}></div>
                    {statusConfig.label}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleResend(invitation.id)}
                      className="flex h-9 min-w-[84px] items-center justify-center gap-1.5 rounded-md border border-border-light bg-card-light px-3 text-xs font-semibold text-text-secondary-light hover:bg-background-light"
                    >
                      Resend
                    </button>
                    <button 
                      onClick={() => handleDelete(invitation.id)}
                      className="flex size-9 items-center justify-center rounded-md border border-border-light bg-card-light text-text-secondary-light hover:bg-background-light"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-text-light-primary">Pending Invitations (0)</h2>
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border-light bg-card-light py-12">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-3xl">mail_lock</span>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-text-light-primary">No pending invitations</h3>
              <p className="text-sm text-text-secondary-light">Send a new invite to get started.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}