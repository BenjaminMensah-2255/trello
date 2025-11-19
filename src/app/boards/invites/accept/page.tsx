'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../../lib/supabase';

export default function AcceptInvitePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invitation, setInvitation] = useState<any>(null);
  const [accepting, setAccepting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const supabase = createClient();

  useEffect(() => {
    if (token) {
      verifyInvitation(token);
    } else {
      setError('Invalid invitation link');
      setLoading(false);
    }
  }, [token]);

  const verifyInvitation = async (inviteToken: string) => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          *,
          organizations (
            name
          )
        `)
        .eq('token', inviteToken)
        .eq('status', 'pending')
        .single();

      if (error) throw error;

      if (!data) {
        setError('Invitation not found or has expired');
        setLoading(false);
        return;
      }

      // Check if invitation is expired
      if (new Date(data.expires_at) < new Date()) {
        setError('This invitation has expired');
        setLoading(false);
        return;
      }

      setInvitation(data);
    } catch (error) {
      console.error('Error verifying invitation:', error);
      setError('Invalid invitation link');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitation) return;

    setAccepting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect to login with return URL
        router.push(`/login?redirect=/invite/accept?token=${token}`);
        return;
      }

      // Add user to organization members
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([
          {
            organization_id: invitation.organization_id,
            user_id: user.id,
            role: invitation.role,
            invited_by: invitation.invited_by
          }
        ]);

      if (memberError) throw memberError;

      // Update invitation status
      const { error: updateError } = await supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      if (updateError) throw updateError;

      // Redirect to organization
      router.push(`/dashboard`);
      
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setError('Error accepting invitation. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary-light">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <span className="material-symbols-outlined text-6xl">error</span>
          </div>
          <h1 className="text-2xl font-bold text-text-light-primary mb-2">Invitation Error</h1>
          <p className="text-text-secondary-light mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-xl border border-border-light p-8 shadow-soft text-center">
          <div className="text-primary mb-4">
            <span className="material-symbols-outlined text-6xl">groups</span>
          </div>
          
          <h1 className="text-2xl font-bold text-text-light-primary mb-2">
            Join {invitation.organizations.name}
          </h1>
          
          <p className="text-text-secondary-light mb-6">
            You've been invited to join <strong>{invitation.organizations.name}</strong> as a <strong>{invitation.role}</strong>.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>Role permissions:</strong><br />
              {invitation.role === 'admin' && 'Full access to manage organization settings and members'}
              {invitation.role === 'editor' && 'Can create and edit boards, but cannot manage organization settings'}
              {invitation.role === 'member' && 'Can view and participate in boards, but has limited editing capabilities'}
            </p>
          </div>

          <button
            onClick={handleAcceptInvitation}
            disabled={accepting}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {accepting ? 'Joining...' : 'Accept Invitation'}
          </button>

          <p className="text-xs text-text-secondary-light mt-4">
            By accepting, you agree to join this organization and abide by its terms.
          </p>
        </div>
      </div>
    </div>
  );
}