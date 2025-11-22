'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { getInvitationByToken, acceptInvitation } from '../../../actions/invitations';

export default function AcceptInvitePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invitation, setInvitation] = useState<any>(null);
  const [accepting, setAccepting] = useState(false);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { user } = useAuth();

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
      console.log('Verifying token:', inviteToken);
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(inviteToken)) {
        setError('Invalid invitation link format.');
        setLoading(false);
        return;
      }
      
      // Fetch invitation using server action (bypasses RLS)
      const { data: invitationData, error } = await getInvitationByToken(inviteToken);

      console.log('Invitation data:', invitationData);
      console.log('Error:', error);

      if (error || !invitationData) {
        setError(error || 'This invitation link is invalid or has been removed.');
        setLoading(false);
        return;
      }

      // Check if invitation exists and is pending
      if (!invitationData) {
        setError('This invitation does not exist.');
        setLoading(false);
        return;
      }

      if (invitationData.status !== 'pending') {
        if (invitationData.status === 'accepted') {
          setError('This invitation has already been accepted.');
        } else if (invitationData.status === 'revoked') {
          setError('This invitation has been revoked by the organization.');
        } else if (invitationData.status === 'expired') {
          setError('This invitation has expired.');
        } else {
          setError('This invitation is no longer valid.');
        }
        setLoading(false);
        return;
      }

      // Check if invitation is expired
      if (new Date(invitationData.expires_at) < new Date()) {
        setError('This invitation has expired.');
        setLoading(false);
        return;
      }

      // Check if the invitation email matches the logged-in user's email
      if (user && user.email && invitationData.email.toLowerCase() !== user.email.toLowerCase()) {
        setError(`This invitation was sent to ${invitationData.email}. Please log in with that account or contact the organization admin.`);
        setLoading(false);
        return;
      }

      // If user is not logged in, prompt them to sign in
      if (!user) {
        setRequiresAuth(true);
        setInvitation(invitationData);
        setLoading(false);
        return;
      }

      setInvitation(invitationData);
    } catch (error) {
      console.error('Error verifying invitation:', error);
      setError('Invalid invitation link');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitation || !user) {
      setError('You must be logged in to accept this invitation.');
      return;
    }

    // Double-check email match
    if (user.email && invitation.email.toLowerCase() !== user.email.toLowerCase()) {
      setError(`This invitation was sent to ${invitation.email}. Please log in with that account.`);
      return;
    }

    setAccepting(true);
    try {
      // Use server action to accept invitation
      const result = await acceptInvitation(
        invitation.id,
        user.id,
        invitation.organization_id,
        invitation.role
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to accept invitation');
      }

      if (result.existing) {
        alert(`You are already a member of ${invitation.organizations.name} as a ${result.role}.`);
      } else {
        alert(`🎉 Successfully joined ${invitation.organizations.name} as a ${invitation.role}!`);
      }

      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      setError(error.message || 'Error accepting invitation. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const handleSignIn = () => {
    // Store the token in session storage to redirect back after login
    if (token) {
      sessionStorage.setItem('pendingInviteToken', token);
    }
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary-light">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-xl border border-border-light p-8 shadow-soft">
            <div className="text-red-500 mb-4">
              <span className="material-symbols-outlined text-6xl">error</span>
            </div>
            <h1 className="text-2xl font-bold text-text-light-primary mb-2">Invitation Error</h1>
            <p className="text-text-secondary-light mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (requiresAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-xl border border-border-light p-8 shadow-soft text-center">
            <div className="text-primary mb-4">
              <span className="material-symbols-outlined text-6xl">login</span>
            </div>
            
            <h1 className="text-2xl font-bold text-text-light-primary mb-2">
              Sign In Required
            </h1>
            
            <p className="text-text-secondary-light mb-6">
              You need to sign in with <strong>{invitation.email}</strong> to accept this invitation to join <strong>{invitation.organizations.name}</strong>.
            </p>

            <button
              onClick={handleSignIn}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-xl border border-border-light p-8 shadow-soft text-center">
          <div className="text-primary mb-4">
            <span className="material-symbols-outlined text-6xl">groups</span>
          </div>
          
          <h1 className="text-2xl font-bold text-text-light-primary mb-2">
            Join {invitation.organizations.name}
          </h1>
          
          <p className="text-text-secondary-light mb-6">
            You've been invited to join <strong>{invitation.organizations.name}</strong> as a <strong className="capitalize">{invitation.role}</strong>.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>Role permissions:</strong><br />
              {invitation.role === 'admin' && 'Full access to manage organization settings, members, and all boards.'}
              {invitation.role === 'editor' && 'Can create and edit boards, invite members, but cannot manage organization settings.'}
              {invitation.role === 'member' && 'Can view and participate in boards with limited editing capabilities.'}
              {invitation.role === 'viewer' && 'Can view boards but cannot make any changes.'}
            </p>
          </div>

          {user && user.email && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 text-sm text-gray-700">
              Accepting as: <strong>{user.email}</strong>
            </div>
          )}

          <button
            onClick={handleAcceptInvitation}
            disabled={accepting}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            {accepting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Joining...
              </span>
            ) : (
              'Accept Invitation'
            )}
          </button>

          <p className="text-xs text-text-secondary-light mt-4">
            By accepting, you agree to join this organization and abide by its terms.
          </p>
        </div>
      </div>
    </div>
  );
}