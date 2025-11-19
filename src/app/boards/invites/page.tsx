'use client';

import { useState, useEffect } from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { createClient } from '../../lib/supabase';

interface Invitation {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  role: string;
  expires_at: string;
  created_at: string;
  invited_by: string;
}

export default function InvitesPage() {
  const [emailInput, setEmailInput] = useState('');
  const [role, setRole] = useState('member');
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { selectedOrganization } = useOrganization();
  const supabase = createClient();

  useEffect(() => {
    if (selectedOrganization) {
      fetchPendingInvitations();
    }
  }, [selectedOrganization]);

  const fetchPendingInvitations = async () => {
    if (!selectedOrganization) return;

    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('organization_id', selectedOrganization.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPendingInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !selectedOrganization) return;

    setSending(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const emails = emailInput.split(',').map(email => email.trim()).filter(email => email);
      
      // Generate invitations for each email
      const invitations = await Promise.all(
        emails.map(async (email) => {
          // Generate a unique token for each invitation
          const token = await generateInviteToken();
          
          const { data: invitation, error } = await supabase
            .from('invitations')
            .insert([
              {
                organization_id: selectedOrganization.id,
                email: email.toLowerCase(),
                token,
                role,
                status: 'pending',
                invited_by: user.id,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
              }
            ])
            .select()
            .single();

          if (error) throw error;
          return invitation;
        })
      );

      // Send email invitations (you'll need to set up email service)
      await sendInvitationEmails(invitations);

      // Refresh the list
      await fetchPendingInvitations();
      setEmailInput('');
      alert('Invitations sent successfully!');
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Error sending invitations. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const generateInviteToken = async (): Promise<string> => {
    // Generate a random token
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return token;
  };

  const sendInvitationEmails = async (invitations: any[]) => {
    // This is where you'd integrate with your email service
    // For now, we'll just log the invite links
    invitations.forEach(invitation => {
      const inviteLink = `${window.location.origin}/invite/accept?token=${invitation.token}`;
      console.log(`Invitation link for ${invitation.email}: ${inviteLink}`);
      
      // In a real app, you would send an email here using:
      // - Resend.com
      // - SendGrid
      // - AWS SES
      // - Nodemailer
      // etc.
    });

    // For demo purposes, show the first invite link
    if (invitations.length > 0) {
      const inviteLink = `${window.location.origin}/invite/accept?token=${invitations[0].token}`;
      alert(`Demo: Invite link generated: ${inviteLink}\n\nIn a real app, this would be sent via email.`);
    }
  };

  const handleResend = async (invitationId: string) => {
    try {
      const invitation = pendingInvitations.find(inv => inv.id === invitationId);
      if (!invitation) return;

      // Generate new token and update expiration
      const newToken = await generateInviteToken();
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from('invitations')
        .update({
          token: newToken,
          expires_at: newExpiresAt,
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (error) throw error;

      // Send new invitation email
      const inviteLink = `${window.location.origin}/invite/accept?token=${newToken}`;
      console.log(`Resent invitation link for ${invitation.email}: ${inviteLink}`);
      
      alert('Invitation resent successfully!');
    } catch (error) {
      console.error('Error resending invitation:', error);
      alert('Error resending invitation. Please try again.');
    }
  };

  const handleDelete = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'revoked' })
        .eq('id', invitationId);

      if (error) throw error;

      // Refresh the list
      await fetchPendingInvitations();
      alert('Invitation revoked successfully!');
    } catch (error) {
      console.error('Error revoking invitation:', error);
      alert('Error revoking invitation. Please try again.');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          dotColor: 'bg-yellow-500',
          label: 'Pending'
        };
      case 'accepted':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          dotColor: 'bg-green-500',
          label: 'Accepted'
        };
      case 'expired':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          dotColor: 'bg-red-500',
          label: 'Expired'
        };
      case 'revoked':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          dotColor: 'bg-gray-500',
          label: 'Revoked'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          dotColor: 'bg-gray-500',
          label: 'Unknown'
        };
    }
  };

  if (!selectedOrganization) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="text-center py-12">
          <p className="text-text-secondary-light">Please select an organization first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      {/* Page Heading */}
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-3xl font-black tracking-tighter text-text-light-primary">
          Invite Members to {selectedOrganization.name}
        </h1>
      </div>

      {/* Invitation Card */}
      <div className="rounded-xl border border-border-light bg-card-light p-6 shadow-soft">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold leading-tight text-text-light-primary">Invite a new member</p>
            <p className="text-sm font-normal leading-normal text-text-secondary-light">
              Enter one or more email addresses separated by commas. Invitations expire after 7 days.
            </p>
          </div>
          
          <form onSubmit={handleSendInvite} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email Input */}
              <label className="flex flex-col">
                <span className="mb-1.5 text-sm font-medium text-text-light-primary">Email address(es)</span>
                <input 
                  className="w-full min-w-0 flex-1 rounded-lg border border-border-light bg-background-light px-4 py-2.5 text-sm text-text-light-primary placeholder:text-text-secondary-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="name@example.com, another@example.com"
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </label>
              
              {/* Role Selection */}
              <label className="flex flex-col">
                <span className="mb-1.5 text-sm font-medium text-text-light-primary">Role</span>
                <select
                  className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2.5 text-sm text-text-light-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="member">Member</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </div>
            
            {/* Send Invite Button */}
            <button 
              type="submit"
              disabled={!emailInput.trim() || sending}
              className="flex h-10 min-w-[84px] max-w-[480px] shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold tracking-wide text-white shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">
                {sending ? 'hourglass_empty' : 'send'}
              </span>
              <span className="truncate">
                {sending ? 'Sending...' : 'Send Invite'}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Pending Invitations List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-text-secondary-light">Loading invitations...</p>
        </div>
      ) : pendingInvitations.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-text-light-primary">
            Pending Invitations ({pendingInvitations.length})
          </h2>
          
          <div className="flex flex-col gap-3">
            {pendingInvitations.map((invitation) => {
              const statusConfig = getStatusConfig(invitation.status);
              const expiresDate = new Date(invitation.expires_at).toLocaleDateString();
              
              return (
                <div key={invitation.id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border border-border-light bg-card-light p-4 shadow-soft">
                  {/* Avatar and Info */}
                  <div className="flex items-center gap-4 flex-grow">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">
                      {invitation.email.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="text-sm font-medium text-text-light-primary">
                        {invitation.email}
                      </div>
                      <div className="text-xs text-text-secondary-light">
                        Role: {invitation.role} • Expires: {expiresDate}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`flex items-center gap-2 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} px-2.5 py-0.5 text-xs font-semibold`}>
                    <div className={`size-1.5 rounded-full ${statusConfig.dotColor}`}></div>
                    {statusConfig.label}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    {invitation.status === 'pending' && (
                      <button 
                        onClick={() => handleResend(invitation.id)}
                        className="flex h-9 min-w-[84px] items-center justify-center gap-1.5 rounded-md border border-border-light bg-card-light px-3 text-xs font-semibold text-text-secondary-light hover:bg-background-light"
                      >
                        Resend
                      </button>
                    )}
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