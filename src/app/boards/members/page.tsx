'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '../../lib/supabase';
import { useOrganization } from '../../contexts/OrganizationContext';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedOrganization } = useOrganization();
  const supabase = createClient();

  useEffect(() => {
    if (selectedOrganization) {
      fetchMembers();
    }
  }, [selectedOrganization]);

  const fetchMembers = async () => {
    if (!selectedOrganization) return;

    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          role,
          user_id,
          users (
            id,
            email,
            user_metadata
          )
        `)
        .eq('organization_id', selectedOrganization.id);

      if (error) throw error;

      const formattedMembers: Member[] = (data || []).map(member => ({
        id: member.user_id,
        name: member.users.user_metadata?.full_name || member.users.email.split('@')[0],
        email: member.users.email,
        role: member.role,
        avatar: member.users.user_metadata?.avatar_url
      }));

      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!selectedOrganization) return;

    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('organization_id', selectedOrganization.id)
        .eq('user_id', memberId);

      if (error) throw error;

      // Refresh the list
      await fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Error removing member. Please try again.');
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );


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
                      className="size-12 rounded-full bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url("${member.avatar}")` }}
                      aria-label={member.altText}
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-text-primary-light text-base font-medium leading-normal line-clamp-1">
                        {member.name}
                      </p>
                      <p className="text-text-secondary-light text-sm font-normal leading-normal line-clamp-2">
                        {member.role}
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