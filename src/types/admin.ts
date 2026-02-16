export interface ContentOverride {
  id: string;
  locale: "ro" | "en";
  key_path: string;
  value: string;
  updated_by: string | null;
  updated_at: string;
}

export interface SeoOverride {
  id: string;
  page_path: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  updated_by: string | null;
  updated_at: string;
}
