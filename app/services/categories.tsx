import { getUserSession } from '@/utils/session';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Categories } from '../models/Categories';

export const fetchCategories = async (): Promise<Categories[]> => {
  try {
    const user = await getUserSession();
    const q = query(
      collection(db, "categories"),
      where("user_id", "==", user.id)
    );
    const querySnapshot = await getDocs(q);
    const categories: Categories[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        user_id: data.user_id,
        name: data.name,
        total_budget: data.total_budget,
      };
    });
    return categories;
  } catch (err) {
    console.error("Error fetching categories: ", err);
    return [];
  }
};
