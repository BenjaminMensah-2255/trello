'use client';

import { useState } from 'react';
import CreateOrganizationModal from '../components/CreateOrganizationModal';

export default function OrganizationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState([
    {
      id: '1',
      name: 'Innovate Inc.',
      projectCount: 12,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCps6HpwXIuzlR7hpjOvn90t2bTtxnzyMgPd4LcnsLcH2jyvCnZvuslzUFtLi5rhGHSMOkIC42yTCa952wPZksBoNSLmcnJW3rAHSTFwNLmIJcAc3sc9m8EZaqBcIUpOCeqVbicHw1aq8f7OYP0lMdX07YnQx8ysbMTVm-jFb3nP0d_vqVPQHmj6nT5EOKPbVO-uGPIMdYgGWGO1L5uZ2cAgQUlppt7Zn65XHHj0IM4HWYRgsSvZgZ8rRxvg5uMWNaGNLMC-KuFJdsO',
      altText: 'Abstract gradient for Innovate Inc.'
    },
    {
      id: '2',
      name: 'Quantum Leap',
      projectCount: 8,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3wQHIRu3ZzBY1Gt7z9r-s-_hvLtRv35sl3JOtnnTCS8I6Nimr3ZWwMqKFoaw7Qk6NJOXias6V2y9fy9QbEydcFt1J4cyzNTQqU5GWcTaLvzZvIvE5JQ4Sv1RC-8UZEOLFTfAvbRA7Mx03jO6GCsHIWYFIhRHoM2tRzVZETNFE8OSQ_ro0VA9c-aTVqJo_hU6E_BnquHZYhMljce9gXpgIZiTPJ0-g4ba6Bh9fvfPiz7Zmyz7-E1d7qeLDEhal2hL1Le_2Tlz1nTip',
      altText: 'Abstract gradient for Quantum Leap'
    },
    {
      id: '3',
      name: 'Synergy Solutions',
      projectCount: 21,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl0eDAdFLQ9kzUNfGtzJubUERNVEr6nn-JT4xUDf9KmNUXtTiP8dCw3wbm3KhUbZGO17B_nO6p2OMTZ3CP210bjxetc_JW-tW9le5jNxhcbahfWToRa_dthblLFNsxPJsUGKsaIA6_PtXJk5tDL3ATycPgevqP0EWnPfIHmJ4A6ZDyUDBTCB93Hm0F1q_IYpbGRwz7gMPIYo3QFFgFwAozqubhBF1mbLK4DP-tE3X-c4VTBNFb228cJz2DoIEZIbkUciP4jbOoacjK',
      altText: 'Abstract gradient for Synergy Solutions'
    },
    {
      id: '4',
      name: 'Apex Digital',
      projectCount: 5,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXgl5_KbW6qOpXJn48zTFgiqzGcxYGNGrzx6mlseD4VeGQcJF0AjyaXIK_-iB9rXztI-QbMUDTkD5RTzEuiz5Xa3J2AsiQFGUFYvYKbANh3q4TGbYfTdU7jKr9S2QNFw_R7Iyn7Hx8YmFtIkU1LsuSkSbfnXzbReFVD4dVEPpgruyL90FdQjaVDpbIMtpM7YZH--MyOg96WruhZW5UFw2LSJfim4WrycaO3TeCb2ee0IFdDZlCMYcRXcqsdEw8hsRopxhmXDvz6NHH',
      altText: 'Abstract gradient for Apex Digital'
    }
  ]);

  const handleCreateOrganization = (organizationName: string) => {
    // Add the new organization to the list
    const newOrganization = {
      id: (organizations.length + 1).toString(),
      name: organizationName,
      projectCount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      altText: `Abstract gradient for ${organizationName}`
    };
    
    setOrganizations(prev => [newOrganization, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-text-light">Organizations</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary h-10 px-5 text-sm font-bold text-white shadow-soft transition-transform hover:scale-105"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span className="truncate">Create New Organization</span>
          </button>
        </header>

        {/* Organizations Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
          {organizations.map((org) => (
            <div key={org.id} className="group flex flex-col gap-4 rounded-lg bg-content-light p-4 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lg">
              <div 
                className="w-full aspect-video rounded-lg bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("${org.imageUrl}")` }}
                aria-label={org.altText}
              />
              <div>
                <p className="text-base font-medium leading-normal text-text-light">
                  {org.name}
                </p>
                <p className="text-sm font-normal leading-normal text-text-secondary-light">
                  {org.projectCount} Active Projects
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (shown when no organizations) */}
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
                onClick={() => setIsModalOpen(true)}
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateOrganization}
      />
    </>
  );
}