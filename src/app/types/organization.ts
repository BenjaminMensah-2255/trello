// types/organization.ts
export interface Organization {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
  project_count: number;
  // UI-specific fields (make them required if needed)
  imageUrl: string;
  altText: string;
  projectCount: number;
}