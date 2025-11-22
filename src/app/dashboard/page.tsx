'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganization } from '../contexts/OrganizationContext';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '../lib/supabase';
import CreateOrganizationModal from '../components/CreateOrganizationModal';
import EditOrganizationModal from '../components/EditOrganizationModal';
import { Organization } from '../types/organization';

export default function OrganizationsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedOrganization, refreshOrganizations } = useOrganization();
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchOrganizations();
    }
  }, [user]);

  const fetchOrganizations = async () => {
    try {
      if (!user) return;

      const { data: memberships, error: membersError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id);

      if (membersError) throw membersError;

      if (!memberships || memberships.length === 0) {
        setOrganizations([]);
        setLoading(false);
        return;
      }

      const orgIds = memberships.map(m => m.organization_id);

      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .in('id', orgIds);

      if (orgsError) throw orgsError;

      if (!orgsData) {
        setOrganizations([]);
        setLoading(false);
        return;
      }

      const organizationsWithCounts = await Promise.all(
        orgsData.map(async (orgData) => {
          const { data: boards } = await supabase
            .from('boards')
            .select('id', { count: 'exact' })
            .eq('organization_id', orgData.id);

          const boardCount = boards?.length || 0;
          const imageUrl = getRandomGradientUrl(orgData.name);
          
          const org: Organization = {
            id: orgData.id,
            name: orgData.name,
            image_url: orgData.image_url,
            created_at: orgData.created_at,
            project_count: boardCount,
            imageUrl: imageUrl,
            altText: `Abstract gradient for ${orgData.name}`,
            projectCount: boardCount
          };
          
          return org;
        })
      );

      setOrganizations(organizationsWithCounts);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const getRandomGradientUrl = (orgName: string) => {
    const gradients = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCps6HpwXIuzlR7hpjOvn90t2bTtxnzyMgPd4LcnsLcH2jyvCnZvuslzUFtLi5rhGHSMOkIC42yTCa952wPZksBoNSLmcnJW3rAHSTFwNLmIJcAc3sc9m8EZaqBcIUpOCeqVbicHw1aq8f7OYP0lMdX07YnQx8ysbMTVm-jFb3nP0d_vqVPQHmj6nT5EOKPbVO-uGPIMdYgGWGO1L5uZ2cAgQUlppt7Zn65XHHj0IM4HWYRgsSvZgZ8rRxvg5uMWNaGNLMC-KuFJdsO',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3wQHIRu3ZzBY1Gt7z9r-s-_hvLtRv35sl3JOtnnTCS8I6Nimr3ZWwMqKFoaw7Qk6NJOXias6V2y9fy9QbEydcFt1J4cyzNTQqU5GWcTaLvzZvIvE5JQ4Sv1RC-8UZEOLFTfAvbRA7Mx03jO6GCsHIWYFIhRHoM2tRzVZETNFE8OSQ_ro0VA9c-aTVqJo_hU6E_BnquHZYhMljce9gXpgIZiTPJ0-g4ba6Bh9fvfPiz7Zmyz7-E1d7qeLDEhal2hL1Le_2Tlz1nTip',
    ];
    
    const hash = orgName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return gradients[Math.abs(hash) % gradients.length];
  };

  const handleCreateOrganization = async (organizationName: string) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data: org, error } = await supabase
        .from('organizations')
        .insert({
          name: organizationName,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      await fetchOrganizations();
      setIsCreateModalOpen(false);
      refreshOrganizations();
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  };

  const handleUpdateOrganization = async (organizationId: string, organizationName: string) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data: membership } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', organizationId)
        .eq('user_id', user.id)
        .single();

      if (membership?.role !== 'admin') {
        throw new Error('Only admins can update organizations');
      }

      const { error } = await supabase
        .from('organizations')
        .update({ name: organizationName })
        .eq('id', organizationId);

      if (error) throw error;

      await fetchOrganizations();
      refreshOrganizations();
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  };

  const handleDeleteOrganization = async (organizationId: string) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data: membership } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', organizationId)
        .eq('user_id', user.id)
        .single();

      if (membership?.role !== 'admin') {
        throw new Error('Only admins can delete organizations');
      }

      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', organizationId);

      if (error) throw error;

      await fetchOrganizations();
      refreshOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
  };

  const handleOrganizationClick = (organization: Organization) => {
    setSelectedOrganization(organization);
    router.push('/boards');
  };

  const handleEditClick = (e: React.MouseEvent, organization: Organization) => {
    e.stopPropagation();
    setSelectedOrg(organization);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-text-light">Loading organizations...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 p-4 lg:p-6 xl:p-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-text-light">Organizations</h2>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary h-10 px-4 lg:px-5 text-sm font-bold text-white shadow-soft transition-transform hover:scale-105 w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span className="truncate">Create Organization</span>
          </button>
        </header>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
          {organizations.map((org) => (
            <div 
              key={org.id} 
              onClick={() => handleOrganizationClick(org)}
              className="group relative bg-white rounded-lg border border-border-light shadow-soft hover:shadow-lifted transition-all duration-200 hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              <div className="aspect-4/3 bg-cover bg-center bg-no-repeat relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url("${org.imageUrl}")` }}
                  aria-label={org.altText}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <button
                  onClick={(e) => handleEditClick(e, org)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                >
                  <span className="material-symbols-outlined text-text-secondary-light text-sm">edit</span>
                </button>
              </div>
              
              <div className="p-3 lg:p-4">
                <h3 className="font-semibold text-text-light text-sm leading-tight truncate mb-1">
                  {org.name}
                </h3>
                <p className="text-text-secondary-light text-xs">
                  {org.projectCount} Active Projects
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {organizations.length === 0 && (
          <div className="mt-6 lg:mt-8 flex flex-col p-4">
            <div className="flex flex-col items-center gap-4 lg:gap-6 rounded-xl border-2 border-dashed border-border-light px-4 lg:px-6 py-12 lg:py-16 text-center">
              <div className="text-primary">
                <span className="material-symbols-outlined text-4xl lg:text-6xl">domain_add</span>
              </div>
              <div className="flex max-w-md flex-col items-center gap-2">
                <p className="text-lg font-bold leading-tight tracking-tight text-text-light">
                  You're not part of any organizations yet
                </p>
                <p className="text-sm font-normal leading-normal text-text-secondary-light px-4">
                  Create a new organization to get started and begin managing your projects.
                </p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary h-10 px-5 text-sm font-bold text-white shadow-soft transition-transform hover:scale-105 w-full sm:w-auto mt-2"
              >
                <span className="material-symbols-outlined">add_circle</span>
                <span className="truncate">Create Organization</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateOrganizationModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateOrganization}
      />

      <EditOrganizationModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateOrganization}
        onDelete={handleDeleteOrganization}
        organization={selectedOrg}
      />
    </>
  );
}