import { FontAwesome5 } from '@expo/vector-icons';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { getUserSession } from '@/utils/session';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Categories } from '../models/Categories';
import { Transactions } from '../models/Transactions';

// SERVICES
import { fetchCategories } from '../services/categories';

export default function Dashboard() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthLabel = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [categories, setCategories] = useState<Categories[]>([]);
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Categories>();
  const [refreshCategories, setRefreshCategories] = useState<boolean>(false);

  const [categoryName, setCategoryName] = useState("");
  const [totalBudget, setTotalBudget] = useState("");

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const detailCategorySheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentDetailCategoryModalPress = useCallback(() => {
    detailCategorySheetModalRef.current?.present();
  }, []);
  const handleSheetDetailCategoryChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  function increaseMonth() {
    if (month == 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  function decreaseMonth() {
    if (month == 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function showFormAddCategory() {
    handlePresentModalPress()
  }

  function showDetailCategoryInfo(category: Categories) {
    setSelectedCategory(category)
    handlePresentDetailCategoryModalPress()
  }

  async function handleAddCategory() {
    try {
      const user = await getUserSession();
      console.log(user)
      await addDoc(collection(db, "categories"), {
        user_id: user.id,
        name: categoryName,
        budget: totalBudget,
        remaining_budget: "0",
        created_date: new Date(),
      });
      setRefreshCategories(true)
      bottomSheetModalRef.current?.close();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setCategoryName("")
    setTotalBudget("")
  }

  function handleAddTransaction() {
    router.push("/create-transaction")
  }

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };

    loadCategories();
  }, [refreshCategories]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const user = await getUserSession();
  
        // 1. Fetch all categories first
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoryMap = new Map();
        categoriesSnapshot.forEach((doc) => {
          const data = doc.data();
          categoryMap.set(doc.id, data.name);
        });
  
        // 2. Fetch all user transactions
        const q = query(
          collection(db, "transactions"),
          where("user_id", "==", user.id)
        );
        const querySnapshot = await getDocs(q);
  
        // 3. Map with category name
        const transactions: Transactions[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            user_id: data.user_id,
            category_id: data.category_id,
            date: data.date,
            amount: data.amount,
            remarks: data.remarks,
            category_name: categoryMap.get(data.category_id) || "Unknown"
          };
        });
  
        setTransactions(transactions);
      } catch (err) {
        console.error("Error fetching transactions: ", err);
      }
    };
  
    fetchTransactions();
  }, []);
  

  return (
    <View className="flex-1 px-2">
      <View className='mt-3 flex flex-row items-center justify-center'>
        <Pressable onPress={decreaseMonth} className='border border-black mx-1 my-1 px-3 py-1 border-b-[3px] border-l-[3px]'>
          <FontAwesome5 name="chevron-left" size={16} color="black" />
        </Pressable>
        <Text className='font-bold px-3'>{monthLabel[month]} {year}</Text>
        <Pressable onPress={increaseMonth} className='border border-black mx-1 my-1 px-3 py-1 border-b-[3px] border-r-[3px]'>
          <FontAwesome5 name="chevron-right" size={16} color="black" />
        </Pressable>
      </View>
      <View className='flex flex-row items-center pt-3'>
        <Text className="text-lg font-bold">Categories</Text>
      </View>
      <View className='flex flex-row flex-wrap'>
        {categories.length > 0 ? (
          categories.map((item) => ( // Use map here
            <Pressable onPress={() => showDetailCategoryInfo(item)} key={item.id} className='border border-black mr-1 my-1 px-3 py-1 border-b-[3px] border-r-[3px]'>
              <Text className='text-xs'>{item.name}</Text>
            </Pressable>
          ))
        ) : (
          <></>
        )}
        <Pressable onPress={showFormAddCategory} className='flex justify-center items-center bg-white border border-black py-1 mx-1 my-1 px-3 border-b-[3px] border-r-[3px]'>
          <FontAwesome5 name="plus" size={12} color="black" />
        </Pressable>
      </View>
      <View className='flex flex-row items-center pt-3'>
        <Text className="text-lg font-bold">Transactions</Text>
      </View>
      <View>
        {transactions.length > 0 ? (
          transactions.map((item) => ( // Use map here
            <Pressable key={item.id} className='border border-black mx-1 my-1 px-3 py-1 border-b-[3px] border-r-[3px]'>
              <Text className='text-xs'>{item.category_name}</Text>
              <Text className='text-xs'>{item.date}</Text>
              <Text className='text-xs'>Rp. {item.amount}</Text>
              <Text className='text-xs'>{item.remarks}</Text>
            </Pressable>
          ))
        ) : (
          <></>
        )}
      </View>
      <Pressable onPress={handleAddTransaction} className='absolute bottom-0 right-0 border-2 border-black rounded-xl p-4 m-3 z-2'>
        <Text><FontAwesome5 name="plus" size={24} color="black"></FontAwesome5></Text>
      </Pressable>
      <GestureHandlerRootView className='flex-1 z-10 bg-white'>
        <BottomSheetModalProvider>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              onChange={handleSheetChanges}
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
            >
              <BottomSheetView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={{ flex: 1 }}
                  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                  <ScrollView
                    contentContainerStyle={{ padding: 16 }}
                    keyboardShouldPersistTaps="handled"
                  >
                    <View className='flex flex-col py-3 px-3'>
                      <Text className='text-xl font-bold text-center'>
                        Add New Category with Budget!
                      </Text>

                      <View className='mt-4'>
                        <Text className='text-slate-800 py-1'>Category Name</Text>
                        <BottomSheetTextInput
                          value={categoryName}
                          onChangeText={setCategoryName}
                          className='border border-slate-500'
                        />
                      </View>

                      <View className='mt-2'>
                        <Text className='text-slate-800 py-1'>Total Budget (Rp)</Text>
                        <BottomSheetTextInput
                          value={totalBudget}
                          onChangeText={setTotalBudget}
                          className='border border-slate-500'
                        />
                      </View>

                      <View className='flex flex-row justify-end mt-4'>
                        <Pressable
                          onPress={handleAddCategory}
                          className='border-2 border-black px-5 py-1'
                        >
                          <Text className='text-black font-bold'>Save</Text>
                        </Pressable>
                      </View>
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>
              </BottomSheetView>
            </BottomSheetModal>
            <BottomSheetModal
              ref={detailCategorySheetModalRef}
              onChange={handleSheetDetailCategoryChanges}
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
            >
              <BottomSheetView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={{ flex: 1 }}
                  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                  <ScrollView
                  className=''
                    contentContainerStyle={{ padding: 16 }}
                    keyboardShouldPersistTaps="handled"
                  >
                    <View className='flex flex-col pt-1 pb-5 px-3 bg-white z-20'>
                      <Text className='text-2xl font-bold text-center uppercase border-b-2'>
                        Detail Category
                      </Text>

                      <View className='mt-4'>
                        <Text className='text-slate-600 py-1'>Name</Text>
                        <Text className='font-bold text-3xl'>{selectedCategory?.name}</Text>
                      </View>

                      <View className='mt-2'>
                        <Text className='text-slate-600 py-1'>Total Budget</Text>
                        <Text className='font-bold text-3xl'>Rp. {selectedCategory?.budget}</Text>
                      </View>

                      <View className='mt-2'>
                        <Text className='text-slate-600 py-1'>Remaining Budget</Text>
                        <Text className='font-bold text-3xl'>Rp. -</Text>
                      </View>
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>
              </BottomSheetView>
            </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
}
