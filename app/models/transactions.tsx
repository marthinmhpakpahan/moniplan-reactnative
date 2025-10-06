export interface Transactions {
    id: string;
    user_id: string;
    category_id: string;
    category_name: string;
    amount: number;
    type: string;
    remarks: string;
    description?: string;
    transaction_date?: string;
    created_at: Date;
    timestamp: Date;
} 