'use client';

import { useState } from 'react';

export default function BoardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [boards, setBoards] = useState([
    {
      id: '1',
      title: 'Q4 Marketing Campaign',
      backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyLeD5cfB64FvQQAm0dXu54uiUtmkycQSImTm1M2tL-b-lPYYBSPzxSNaNf4Nu2qdpQj0dtqlV0h6CvzpF0NtQydURF4uiMRFWl4WDe2zGqPZEuGHhG2AbwLelL1KKpREnjm-qYN93cShFZQjWGrEJuMe5c0-Jq3kslgHSTfPyy-vwms5GI1seht4Cwsrl2GquzJdmi19V24PWU7iXthS0HeMqT8M0zC4SbWE1j8-4k9LIFx7aV-BFq_JDEhSe4qMXnThDF6wRP88C',
      altText: 'A vibrant gradient background for a marketing campaign board',
      isStarred: false
    },
    {
      id: '2',
      title: 'Website Redesign',
      backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwjik6dofjMEnCEdMybnUSw8kx-vJWTONwfIwgiLOVpvXJJx3a4BA7RnnJt7gt45LMtuk6CpFwIP1WarG5rRYhNC4Hs8dY9XHyKsolRainPFRUmq4S1RTBr5-eRv37087poMfjpYjWVk5wzu3y5NgG1Ryoc4P02bwivxcnytTtMM2KfZDoTr2X2zrv03Sj8HOnbZ68JJmxTRNiAiWdQ2S1FM5-iYCAGRFa9eBSA78lBnaaYCc5wL2V1Dw_mbKbTByDTxklEt8pQnOg',
      altText: 'A calm blue and purple gradient background for a website redesign board',
      isStarred: false
    },
    {
      id: '3',
      title: 'Mobile App v2.0',
      backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADjm8nnTmCMOqogAiGiwbmtss3LUttoLzQOuZFErqkiMpdQn8uLajpXlZxb5M3UXO7NHCgiKy0HtsQj_2p3ZYTS6Xa2wpvlRwUX8XycfdnwKhbmGvPEoN79tQXyCrgksP3TIYMd-j4x4cIQi8JIs1VOWIwvSvKY9PbjDHBdcX-g3eWkCdaM44EO8EDimDyYuSOBQaGwk9WQ9nyvP4Tal3Dt1wayqC58H-0Qo5IZjEzPff58n8pVb_yBGtu2fsMxfjS3RMB5kMsco1J',
      altText: 'A dynamic, energetic red gradient background for a mobile app project',
      isStarred: true
    },
    {
      id: '4',
      title: 'User Onboarding Flow',
      backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5TjJYTQ1MfcBzTSrEAWmanf_o7pP9NOXjv-Fh3oobeE2MfVKiepBwKp-Y_Bh1YrNnvrqqxaBlD_0XWNtn-VYa2j7G1clGG73phzgaJQYU4KrgITjc2_uaQWex_6TVXN78-_m--wkxwV80h6YVBOVFj8xm9E4fIlYzRrePA997uOnMwhkbat7m31DtAuMjNFVE24xWlHElPwtdvXFhT19r-ZfvemHip-CmdAZA61kndW2IBKn_8wbwFy1cNrrtGaJuJ4oe3B5VFmFg',
      altText: 'A soft, inviting green gradient background for a user onboarding project',
      isStarred: false
    },
    {
      id: '5',
      title: '2024 Content Calendar',
      backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB00L9CjpL2UZn2NfkR18pViXRfPhiGwU3Ff4gH3eXZqHXZ9-CKJ-_H9XPcrjZzdkzmYK9lfeMSlJ_TOdgd1nqCahKGCpqNzXEalU__1-cvXH02ushvy4Q9rmrMqBuz8-soasbDc_svT-gQ2Gq8ZoaFLqni_0LZoT1Oc2mQ94vc4Fsiy9tue6PybI8rvI5SnHCXmVhDjZfv09zXxM4BMbnVAIRcwy9LoXbsfvO5a7Sg5aNE_BtZdlkp9qtZdsn53t2BAduMOBXf7nzg',
      altText: 'A dark and focused background for a content calendar',
      isStarred: false
    },
    {
      id: '6',
      title: 'API Integration',
      backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeoC1MXtQTXom0YAkK0Lz2x1Ej5If8dYieTrXBPHQj2QAhbphmAVO1Y4gLMuzf95O2J7l5175SJlR23LK27Wapdc2Asxj6y8Zk1scB6DWKx1VpEcw7JCJbda39APmZFgo_Bvykcvp4JG6zks8igxuwpPtRiIJlV_Af1jkicTSdU4H5kB8JiywT9wVdI1wWl_8QBAIWKi3x8xCSvbZF05r9rdyz0l1juGfBH4dvUIDm616BmmW7ov1kHVOpcN4drIL6T9bR0sQLDt1k',
      altText: 'A professional, structured background for an API project',
      isStarred: true
    }
  ]);

  const toggleStar = (boardId: string) => {
    setBoards(boards.map(board => 
      board.id === boardId 
        ? { ...board, isStarred: !board.isStarred }
        : board
    ));
  };

  const filteredBoards = boards.filter(board =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold leading-tight tracking-tight">Boards</h1>
          <p className="text-base font-normal leading-normal text-text-secondary-light">
            All project boards in your workspace.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <label className="flex flex-col h-11 w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-text-secondary-light flex items-center justify-center pl-3 pr-2 bg-card-light border border-r-0 border-border-light rounded-l-lg">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
              </div>
              <input 
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 border bg-card-light border-border-light placeholder:text-text-secondary-light px-2 rounded-l-none"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </label>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-4 bg-primary text-white text-sm font-medium leading-normal shadow-soft hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
            <span className="truncate">Create new board</span>
          </button>
        </div>
      </header>

      {/* Board Grid Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Your Boards</h2>
        
        {/* Board Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {filteredBoards.map((board) => (
            <div 
              key={board.id}
              className="group relative flex flex-col justify-end p-4 aspect-[16/10] bg-cover bg-center rounded-xl transition-all shadow-soft hover:shadow-lifted cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("${board.backgroundImage}")`
              }}
            >
              <p className="text-white text-lg font-bold leading-tight">{board.title}</p>
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(board.id);
                  }}
                  className="p-1.5 rounded-md hover:bg-white/20"
                >
                  <span 
                    className={`material-symbols-outlined text-white`}
                    style={{ 
                      fontSize: '20px',
                      fontVariationSettings: board.isStarred ? "'FILL' 1" : "'FILL' 0"
                    }}
                  >
                    star
                  </span>
                </button>
                <button className="p-1.5 rounded-md hover:bg-white/20">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>more_vert</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Empty State */}
      {filteredBoards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 256 256">
                <path fill="currentColor" d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 160H40V56h176zM100 88a12 12 0 0 1 12-12h24a12 12 0 0 1 0 24h-24a12 12 0 0 1-12-12m-4 56a12 12 0 0 1 12-12h72a12 12 0 0 1 0 24H108a12 12 0 0 1-12-12"/>
              </svg>
            </div>
            <div className="flex max-w-sm flex-col items-center gap-2">
              <p className="text-xl font-bold leading-tight">No boards yet</p>
              <p className="text-sm font-normal leading-normal text-text-secondary-light">
                Get started by creating a new board for your projects, ideas, or workflows.
              </p>
            </div>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-sm font-medium leading-normal shadow-soft hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
              <span className="truncate">Create your first board</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}