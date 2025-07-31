export interface Transactions {
    id: string;
    user_id: string;
    category_id: string;
    amount: number;
    remarks: string;
    description?: string;
    timestamp: Date;
} 