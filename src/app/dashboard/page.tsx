'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganization } from '../contexts/OrganizationContext';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '../lib/supabase';
import CreateOrganizationModal from '../components/CreateOrganizationModal';
import EditOrganizationModal from '../components/EditOrganizationModal';
import { Organization } from '../types/Organization';

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

      // Use the alternative approach for better reliability
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

      // Extract organization IDs
      const orgIds = memberships.map(m => m.organization_id);

      // Fetch organizations by IDs
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

      // Fetch board counts for each organization and create Organization objects
      const organizationsWithCounts = await Promise.all(
        orgsData.map(async (orgData) => {
          const { data: boards } = await supabase
            .from('boards')
            .select('id', { count: 'exact' })
            .eq('organization_id', orgData.id);

          const boardCount = boards?.length || 0;
          const imageUrl = getRandomGradientUrl(orgData.name);
          
          // Create Organization object
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

      // TypeScript now knows this is Organization[], not (Organization | null)[]
      setOrganizations(organizationsWithCounts);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function for gradient URLs
  const getRandomGradientUrl = (orgName: string) => {
    const gradients = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCps6HpwXIuzlR7hpjOvn90t2bTtxnzyMgPd4LcnsLcH2jyvCnZvuslzUFtLi5rhGHSMOkIC42yTCa952wPZksBoNSLmcnJW3rAHSTFwNLmIJcAc3sc9m8EZaqBcIUpOCeqVbicHw1aq8f7OYP0lMdX07YnQx8ysbMTVm-jFb3nP0d_vqVPQHmj6nT5EOKPbVO-uGPIMdYgGWGO1L5uZ2cAgQUlppt7Zn65XHHj0IM4HWYRgsSvZgZ8rRxvg5uMWNaGNLMC-KuFJdsO',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3wQHIRu3ZzBY1Gt7z9r-s-_hvLtRv35sl3JOtnnTCS8I6Nimr3ZWwMqKFoaw7Qk6NJOXias6V2y9fy9QbEydcFt1J4cyzNTQqU5GWcTaLvzZvIvE5JQ4Sv1RC-8UZEOLFTfAvbRA7Mx03jO6GCsHIWYFIhRHoM2tRzVZETNFE8OSQ_ro0VA9c-aTVqJo_hU6E_BnquHZYhMljce9gXpgIZiTPJ0-g4ba6Bh9fvfPiz7Zmyz7-E1d7qeLDEhal2hL1Le_2Tlz1nTip',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDl0eDAdFLQ9kzUNfGtzJubUERNVEr6nn-JT4xUDf9KmNUXtTiP8dCw3wbm3KhUbZGO17B_nO6p2OMTZ3CP210bjxetc_JW-tW9le5jNxhcbahfWToRa_dthblLFNsxPJsUGKsaIA6_PtXJk5tDL3ATycPgevqP0EWnPfIHmJ4A6ZDyUDBTCB93Hm0F1q_IYpbGRwz7gMPIYo3QFFgFwAozqubhBF1mbLK4DP-tE3X-c4VTBNFb228cJz2DoIEZIbkUciP4jbOoacjK',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXgl5_KbW6qOpXJn48zTFgiqzGcxYGNGrzx6mlseD4VeGQcJF0AjyaXIK_-iB9rXztI-QbMUDTkD5RTzEuiz5Xa3J2AsiQFGUFYvYKbANh3q4TGbYfTdU7jKr9S2QNFw_R7Iyn7Hx8YmFtIkU1LsuSkSbfnXzbReFVD4dVEPpgruyL90FdQjaVDpbIMtpM7YZH--MyOg96WruhZW5UFw2LSJfim4WrycaO3TeCb2ee0IFdDZlCMYcRXcqsdEw8hsRopxhmXDvz6NHH'
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
      <div className="mx-auto max-w-5xl p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-text-light">Loading organizations...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-5xl p-8">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-text-light">Organizations</h2>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary h-10 px-5 text-sm font-bold text-white shadow-soft transition-transform hover:scale-105"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span className="truncate">Create New Organization</span>
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {organizations.map((org) => (
            <div 
              key={org.id} 
              onClick={() => handleOrganizationClick(org)}
              className="group relative bg-white rounded-lg border border-border-light shadow-soft hover:shadow-lifted transition-all duration-200 hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              <div className="aspect-[4/3] bg-cover bg-center bg-no-repeat relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url("${org.imageUrl}")` }}
                  aria-label={org.altText}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <button
                  onClick={(e) => handleEditClick(e, org)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                >
                  <span className="material-symbols-outlined text-text-secondary-light text-sm">edit</span>
                </button>
              </div>
              
              <div className="p-4">
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

        {organizations.length === 0 && (
          <div className="mt-8 flex flex-col p-4">
            <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-border-light px-6 py-16 text-center">
              <div className="text-primary">
                <span className="material-symbols-outlined text-6xl">domain_add</span>
              </div>
              <div className="flex max-w-md flex-col items-center gap-2">
                <p className="text-lg font-bold leading-tight tracking-tight text-text-light">
                  You're not part of any organizations yet
                </p>
                <p className="text-sm font-normal leading-normal text-text-secondary-light">
                  Create a new organization to get started and begin managing your projects.
                </p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary h-10 px-5 text-sm font-bold text-white shadow-soft transition-transform hover:scale-105"
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