export interface FundingRound {
  id: string;
  startup_name: string;
  startup_letter: string;
  founded_year: string | null;
  stage: string;
  total_funding: string;
  sector: string | null;
  created_at: string;
}

export interface Investor {
  id: string;
  name: string;
  letter: string;
  portfolio_companies: number;
  total_investments: string;
  created_at: string;
}
