// boards/members/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useAuth } from '../../contexts/AuthContext';
import { createClient } from '../../lib/supabase';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  joined_at: string;
}

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { selectedOrganization } = useOrganization();
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (selectedOrganization && user) {
      fetchMembers();
    }
  }, [selectedOrganization, user]);

  const fetchMembers = async () => {
    if (!selectedOrganization || !user) {
      console.log('Missing organization or user');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('Starting members fetch...');
      console.log('Organization ID:', selectedOrganization.id);
      console.log('User ID:', user.id);

      // Use the simple approach to avoid join complications
      await fetchMembersSimple();

    } catch (error: any) {
      console.error('💥 Overall fetch error:', error);
      setError(error.message || 'Unknown error occurred');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembersSimple = async () => {
  if (!selectedOrganization) return;

  try {
    console.log('Using simple fetch approach...');
    
    // Get member user IDs
    const { data: membersData, error: membersError } = await supabase
      .from('organization_members')
      .select('user_id, role, joined_at')
      .eq('organization_id', selectedOrganization.id)
      .order('joined_at', { ascending: false });

    if (membersError) throw membersError;

    console.log('Simple approach - members data:', membersData);

    if (!membersData || membersData.length === 0) {
      setMembers([]);
      return;
    }

    // Get user IDs
    const userIds = membersData.map(member => member.user_id);
    console.log('User IDs to fetch:', userIds);

    // Fetch profiles (now with email!)
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, email') // Added email here
      .in('id', userIds);

    if (profilesError) throw profilesError;

    console.log('Simple approach - profiles data:', profilesData);

    // Combine the data
    const transformedMembers: Member[] = [];
    
    for (const member of membersData) {
      const profile = profilesData?.find(p => p.id === member.user_id);
      
      if (profile) {
        transformedMembers.push({
          id: member.user_id,
          name: profile.full_name || profile.email.split('@')[0], // Use email as fallback for name
          email: profile.email, // Now we have the actual email!
          role: member.role,
          avatar_url: profile.avatar_url || undefined,
          joined_at: member.joined_at
        });
      } else {
        console.warn('No profile found for user ID:', member.user_id);
        // This shouldn't happen now, but keep as fallback
        transformedMembers.push({
          id: member.user_id,
          name: 'Unknown User',
          email: 'user@unknown.com',
          role: member.role,
          joined_at: member.joined_at
        });
      }
    }

    console.log('Simple approach - final members:', transformedMembers);
    setMembers(transformedMembers);

  } catch (error: any) {
    console.error('💥 Simple fetch error:', error);
    setError(`Simple approach failed: ${error.message}`);
    setMembers([]);
  }
};

  const removeMember = async (memberId: string) => {
    if (!selectedOrganization || !user) return;

    try {
      // Check if current user is admin
      const { data: currentUserMembership } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', selectedOrganization.id)
        .eq('user_id', user.id)
        .single();

      if (!currentUserMembership) {
        alert('You are not a member of this organization.');
        return;
      }

      if (currentUserMembership.role !== 'admin') {
        alert('Only organization admins can remove members.');
        return;
      }

      // Prevent removing yourself
      if (memberId === user.id) {
        alert('You cannot remove yourself from the organization.');
        return;
      }

      // Remove member from organization
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('organization_id', selectedOrganization.id)
        .eq('user_id', memberId);

      if (error) throw error;

      // Update local state
      setMembers(prev => prev.filter(member => member.id !== memberId));
      
      alert('Member removed successfully!');
    } catch (error: any) {
      console.error('Error removing member:', error);
      alert(`Error removing member: ${error.message}`);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading members...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">    

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-primary-light text-3xl font-black tracking-tight">Organization Members</h1>
          <p className="text-text-secondary-light text-base font-normal leading-normal">
            Showing {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link 
          href="/boards/invites"
          className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
          <span className="truncate">Invite Member</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-white border border-border-light focus-within:ring-2 focus-within:ring-primary/50">
            <div className="text-text-secondary-light flex items-center justify-center pl-4">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-text-primary-light focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-text-secondary-light px-2 text-base font-normal leading-normal"
              placeholder="Find member by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </label>
      </div>

      {/* Member List Container */}
      <div className="bg-white border border-border-light rounded-lg shadow-soft overflow-hidden">
        {filteredMembers.length > 0 ? (
          <ul className="divide-y divide-border-light">
            {filteredMembers.map((member) => (
              <li key={member.id} className="hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-4 px-6 min-h-[72px] py-3 justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="size-12 rounded-full bg-cover bg-center bg-no-repeat border-2 border-white shadow-sm"
                      style={{ backgroundImage: member.avatar_url ? `url("${member.avatar_url}")` : 'none' }}
                    >
                      {!member.avatar_url && (
                        <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium text-sm">
                          {member.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-text-primary-light text-base font-medium leading-normal line-clamp-1">
                        {member.name}
                      </p>
                      <p className="text-text-secondary-light text-sm font-normal leading-normal line-clamp-2">
                        {member.email} • {member.role}
                      </p>
                      <p className="text-text-secondary-light text-xs">
                        Joined {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <button 
                      onClick={() => removeMember(member.id)}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white border border-border-light text-text-primary-light text-sm font-medium leading-normal hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <span className="truncate">Remove</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="text-primary">
                <span className="material-symbols-outlined text-6xl">group_off</span>
              </div>
              <div className="flex max-w-sm flex-col items-center gap-2">
                <p className="text-xl font-bold leading-tight">No members found</p>
                <p className="text-sm font-normal leading-normal text-text-secondary-light">
                  {searchQuery ? 'No members match your search.' : 'Get started by inviting your first team member.'}
                </p>
              </div>
              {!searchQuery && (
                <Link 
                  href="/boards/invites"
                  className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                  <span className="truncate">Invite Member</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}