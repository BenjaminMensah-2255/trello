// types/board.ts
export interface Board {
  id: string;
  title: string;
  background_image: string | null;
  is_starred: boolean;
  organization_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  // UI-specific fields (compatibility)
  backgroundImage?: string;
  altText?: string;
  isStarred?: boolean; // For compatibility with OrganizationContext
}