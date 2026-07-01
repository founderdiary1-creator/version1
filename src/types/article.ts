export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at: string;
}

export interface ContentBlock {
  id: string;
  subheading?: string;
  content: string;
  image_url?: string;
  image_caption?: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  author_id?: string;
  author_name?: string;
  status: 'draft' | 'published' | 'archived';
  is_premium: boolean;
  is_featured: boolean;
  is_editors_pick: boolean;
  featured_image?: string;
  read_time?: string;
  category_id?: string;
  category?: Category;
  industry_id?: string;
  industry?: Industry;
  created_at: string;
  published_at?: string;
  company_id?: string;
  summary_points?: string[];
  content_blocks?: ContentBlock[];
}

export interface ArticleInsert {
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  author_name?: string;
  author_id?: string;
  is_premium?: boolean;
  is_featured?: boolean;
  is_editors_pick?: boolean;
  status?: 'draft' | 'published' | 'archived';
  featured_image?: string;
  read_time?: string;
  category_id?: string;
  industry_id?: string;
  created_at?: string;
  published_at?: string;
  company_id?: string;
  summary_points?: string[];
  content_blocks?: ContentBlock[];
}

export interface ArticleUpdate extends Partial<ArticleInsert> {
  id: string;
}

export interface ArticleCardProps {
  image: string;
  category: string;
  title: string;
  author: string;
  date: string;
  slug?: string;
}
