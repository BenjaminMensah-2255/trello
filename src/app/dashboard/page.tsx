'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';
import CreateOrganizationModal from '../components/CreateOrganizationModal';
import EditOrganizationModal from '../components/EditOrganizationModal';

interface Organization {
  id: string;
  name: string;
  projectCount: number;
  imageUrl: string;
  altText: string;
}

export default function OrganizationsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedOrganization, refreshOrganizations } = useOrganization();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data: orgsData, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedOrgs: Organization[] = (orgsData || []).map(org => ({
        id: org.id,
        name: org.name,
        projectCount: 0, // You can add a count query later
        imageUrl: getRandomGradientUrl(org.name),
        altText: `Abstract gradient for ${org.name}`
      }));

      setOrganizations(transformedOrgs);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get consistent gradient URLs based on organization name
  const getRandomGradientUrl = (orgName: string) => {
    const gradients = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCps6HpwXIuzlR7hpjOvn90t2bTtxnzyMgPd4LcnsLcH2jyvCnZvuslzUFtLi5rhGHSMOkIC42yTCa952wPZksBoNSLmcnJW3rAHSTFwNLmIJcAc3sc9m8EZaqBcIUpOCeqVbicHw1aq8f7OYP0lMdX07YnQx8ysbMTVm-jFb3nP0d_vqVPQHmj6nT5EOKPbVO-uGPIMdYgGWGO1L5uZ2cAgQUlppt7Zn65XHHj0IM4HWYRgsSvZgZ8rRxvg5uMWNaGNLMC-KuFJdsO',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3wQHIRu3ZzBY1Gt7z9r-s-_hvLtRv35sl3JOtnnTCS8I6Nimr3ZWwMqKFoaw7Qk6NJOXias6V2y9fy9QbEydcFt1J4cyzNTQqU5GWcTaLvzZvIvE5JQ4Sv1RC-8UZEOLFTfAvbRA7Mx03jO6GCsHIWYFIhRHoM2tRzVZETNFE8OSQ_ro0VA9c-aTVqJo_hU6E_BnquHZYhMljce9gXpgIZiTPJ0-g4ba6Bh9fvfPiz7Zmyz7-E1d7qeLDEhal2hL1Le_2Tlz1nTip',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDl0eDAdFLQ9kzUNfGtzJubUERNVEr6nn-JT4xUDf9KmNUXtTiP8dCw3wbm3KhUbZGO17B_nO6p2OMTZ3CP210bjxetc_JW-tW9le5jNxhcbahfWToRa_dthblLFNsxPJsUGKsaIA6_PtXJk5tDL3ATycPgevqP0EWnPfIHmJ4A6ZDyUDBTCB93Hm0F1q_IYpbGRwz7gMPIYo3QFFgFwAozqubhBF1mbLK4DP-tE3X-c4VTBNFb228cJz2DoIEZIbkUciP4jbOoacjK',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXgl5_KbW6qOpXJn48zTFgiqzGcxYGNGrzx6mlseD4VeGQcJF0AjyaXIK_-iB9rXztI-QbMUDTkD5RTzEuiz5Xa3J2AsiQFGUFYvYKbANh3q4TGbYfTdU7jKr9S2QNFw_R7Iyn7Hx8YmFtIkU1LsuSkSbfnXzbReFVD4dVEPpgruyL90FdQjaVDpbIMtpM7YZH--MyOg96WruhZW5UFw2LSJfim4WrycaO3TeCb2ee0IFdDZlCMYcRXcqsdEw8hsRopxhmXDvz6NHH'
    ];
    
    // Simple hash to get consistent gradient for same org name
    const hash = orgName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return gradients[Math.abs(hash) % gradients.length];
  };

  const handleCreateOrganization = async (organizationName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: newOrg, error } = await supabase
        .from('organizations')
        .insert([
          {
            name: organizationName,
            created_by: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Add the new organization to the list with proper styling
      const newOrganization: Organization = {
        id: newOrg.id,
        name: newOrg.name,
        projectCount: 0,
        imageUrl: getRandomGradientUrl(newOrg.name),
        altText: `Abstract gradient for ${newOrg.name}`
      };

      setOrganizations(prev => [newOrganization, ...prev]);
      setIsCreateModalOpen(false);
      refreshOrganizations();
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  const handleUpdateOrganization = async (organizationId: string, organizationName: string) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ name: organizationName })
        .eq('id', organizationId);

      if (error) throw error;

      // Update local state
      setOrganizations(prev => 
        prev.map(org => 
          org.id === organizationId 
            ? { ...org, name: organizationName }
            : org
        )
      );
      refreshOrganizations();
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  const handleDeleteOrganization = async (organizationId: string) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', organizationId);

      if (error) throw error;

      // Remove from local state
      setOrganizations(prev => prev.filter(org => org.id !== organizationId));
      refreshOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  const handleOrganizationClick = (organization: Organization) => {
    // Set the selected organization in context
    setSelectedOrganization(organization);
    // Navigate to boards page
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
        {/* Page Header */}
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

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {organizations.map((org) => (
            <div 
              key={org.id} 
              onClick={() => handleOrganizationClick(org)}
              className="group relative bg-white rounded-lg border border-border-light shadow-soft hover:shadow-lifted transition-all duration-200 hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              {/* Organization Image */}
              <div className="aspect-[4/3] bg-cover bg-center bg-no-repeat relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url("${org.imageUrl}")` }}
                  aria-label={org.altText}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Edit Button */}
                <button
                  onClick={(e) => handleEditClick(e, org)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                >
                  <span className="material-symbols-outlined text-text-secondary-light text-sm">edit</span>
                </button>
              </div>
              
              {/* Organization Info */}
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

        {/* Empty State */}
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

      {/* Create Organization Modal */}
      <CreateOrganizationModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateOrganization}
      />

      {/* Edit Organization Modal */}
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