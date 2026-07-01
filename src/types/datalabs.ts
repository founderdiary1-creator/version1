export interface CompanyProfile {
  id: string;
  name: string;
  slug: string;
  sector: string;
  founding_year: number;
  hq_city: string;
  founders: string[];
  total_funding_amount: string; // e.g., "$150M"
  logo_url?: string;
  created_at: string;
}

export interface FundingRound {
  id: string;
  company_id: string;
  amount: string;
  stage: string;
  lead_investors: string[];
  date: string;
  created_at: string;
  company?: CompanyProfile; // For joined queries
}

export interface ArticleSummaryPoint {
  id: string;
  text: string;
}

// Extending the existing article type logic
export interface ArticleWithDataLabs {
  id: string;
  // Extracted summary points attached to an article
  summary_points?: string[];
  // Linked company profile ID for the Go Deeper section
  company_id?: string;
  company?: CompanyProfile;
}
