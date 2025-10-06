export interface MonthlyBudget {
    id: string;           // E.g., "groceries_07_2025"
    user_id: string;
    category_id: string;
    month: number;
    year: number;
    budget: number;
    remaining_budget: number;
  }
  