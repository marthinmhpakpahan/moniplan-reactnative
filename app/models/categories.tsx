import { Transactions } from "./transactions";

export interface Categories {
    id: string;
    user_id: string;
    name: string;
    amount: number;
    remaining_budget: number;
    total_transaction: number;
}

export const getDetailCategory = (category: Categories, transactions: Transactions[]) => {
    let totalTransactions = 0;
    let totalExpense = 0;
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].type.toLowerCase() == "expense" && transactions[i].category_name == category.name) {
            totalExpense += transactions[i].amount
            totalTransactions += 1
        }
    }
    category.remaining_budget = category.amount - totalExpense;
    category.total_transaction = totalTransactions;
    
    return category;
}