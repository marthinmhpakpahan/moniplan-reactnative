import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
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

import { Categories } from '../models/Categories';
import { Transactions } from '../models/Transactions';

// SERVICES
import { createCategory, indexCategory } from '../services/categories';
import { indexTransaction } from '../services/transactions';

export default function Dashboard() {
  const currentDate = new Date();
  console.log("Dasboard current date: ", currentDate);
  const currentMonth = currentDate.getMonth() + 1;
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
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const [remainingBudget, setRemainingBudget] = useState<{ [key: string]: string }>({});

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
    console.log('handleSheetDetailCategoryChanges', index);
  }, []);

  function increaseMonth() {
    if (month == 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  function decreaseMonth() {
    if (month == 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function showFormAddCategory() {
    handlePresentModalPress()
  }

  function showDetailCategoryInfo(category: Categories) {
    console.log("showDetailCategoryInfo", remainingBudget["internet"])
    let category_name = category.name ? category.name : "";
    category.remaining_budget = 0;
    if(category_name != "") {
      category.remaining_budget = remainingBudget[category_name].amount
    }
    setSelectedCategory(category)
    handlePresentDetailCategoryModalPress()
  }

  async function handleAddCategory() {
    try {
      const response = await createCategory(
        categoryName, month, year, parseInt(totalBudget)
      );
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
      try {
        const response = await indexCategory(month, year);
        const data = response.data || [];
        setCategories(data);
        
        const budgetObj: { [key: string]: string } = {};
        for (let i = 0; i < data.length; i++) {
          budgetObj[data[i].name.toLowerCase()] = data[i].amount
        }
        setRemainingBudget(budgetObj)
      } catch (err) {
        console.error("Error fetching categories: ", err);
      }
    };

    loadCategories();
  }, [month, year]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await indexTransaction(month, year);
        const data = response.data || [];
        setTransactions(data);
        let totalIncome = 0, totalExpense = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].type.toLowerCase() == "expense") {
            totalExpense += data[i].amount
          } else {
            totalIncome += data[i].amount
          }
        }
        setTotalIncome(totalIncome)
        setTotalExpense(totalExpense)
      } catch (err) {
        console.error("Error fetching transactions: ", err);
      }
    };

    fetchTransactions();
  }, [month, year]);


  return (
    <View className="flex-1 px-2">
      <View className='mt-3 flex flex-row items-center justify-center'>
        <Pressable onPress={decreaseMonth} className='border border-black mx-1 my-1 px-3 py-1 border-b-[3px] border-l-[3px]'>
          <FontAwesome5 name="chevron-left" size={16} color="black" />
        </Pressable>
        <Text className='font-bold px-3'>{monthLabel[month - 1]} {year}</Text>
        <Pressable onPress={increaseMonth} className='border border-black mx-1 my-1 px-3 py-1 border-b-[3px] border-r-[3px]'>
          <FontAwesome5 name="chevron-right" size={16} color="black" />
        </Pressable>
      </View>
      <View className='flex flex-row items-center pt-3'>
        <Text className="text-lg font-bold">Categories</Text>
      </View>
      <View className='flex flex-row flex-wrap'>
        {categories?.length > 0 ? (
          categories.map((item) => ( // Use map here
            <Pressable onPress={() => showDetailCategoryInfo(item)} key={item.id} className='border border-black mr-1 my-1 px-3 py-1 border-b-[3px] border-r-[3px]'>
              <Text className='text-sm font-semibold'>{item.name.toUpperCase()}</Text>
            </Pressable>
          ))
        ) : (
          <></>
        )}
        <Pressable onPress={showFormAddCategory} className='flex justify-center items-center bg-white border border-black py-1 mx-1 my-1 px-3 border-b-[3px] border-r-[3px]'>
          <FontAwesome5 name="plus" size={12} color="black" />
        </Pressable>
      </View>
      <View className='flex flex-row items-center pt-3 justify-between pr-2'>
        <View className='flex flex-row items-center'>
          <Text className="text-lg font-bold">Transactions</Text>
          <Pressable onPress={handleAddTransaction} className='border-2 border-black px-3 py-1 m-3 z-100'>
            <Text><FontAwesome5 name="plus" size={12} color="black"></FontAwesome5></Text>
          </Pressable>
        </View>
        <View className='flex flex-row items-center'>
          <View className='flex flex-row items-center'>
            <MaterialCommunityIcons name="arrow-down" size={20} color="green" />
            <Text className='text-green-800 font-bold'>Rp. {new Intl.NumberFormat().format(totalIncome)}</Text>
          </View>
          <View className='flex flex-row items-center ml-3'>
            <MaterialCommunityIcons name="arrow-up" size={20} color="red" />
            <Text className='text-red-500 font-bold'>Rp. {new Intl.NumberFormat().format(totalExpense)}</Text>
          </View>
        </View>
      </View>
      <View>
        {transactions?.length > 0 ? (
          transactions.map((item) => ( // Use map here
            <Pressable key={item.id} className='border border-black mx-1 my-1 px-3 py-1 border-b-[3px] border-r-[3px]'>
              <View className='flex flex-row justify-between items-center'>
                <Text className='text-2xl font-bold'>Rp. {item.amount}</Text>
                <Text className='text-xs font-semibold'>{item.transaction_date}</Text>
              </View>
              <Text className='text-md font-semibold mt-2'>{item.category_name.toUpperCase()}</Text>
              <Text className='text-sm font-normal'>{item.remarks}</Text>
            </Pressable>
          ))
        ) : (
          <></>
        )}
      </View>
      <GestureHandlerRootView className='flex-1 z-3 bg-white'>
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
                      <Text className='font-bold text-3xl'>{selectedCategory?.name.toUpperCase()}</Text>
                    </View>

                    <View className='mt-2'>
                      <Text className='text-slate-600 py-1'>Total Budget</Text>
                      <Text className='font-bold text-3xl'>Rp. {new Intl.NumberFormat().format(selectedCategory ? selectedCategory.amount : 0)}</Text>
                    </View>

                    <View className='mt-2'>
                      <Text className='text-slate-600 py-1'>Remaining Budget</Text>
                      <Text className='font-bold text-3xl'>Rp. {new Intl.NumberFormat().format(selectedCategory ? selectedCategory.remaining_budget : 0)}</Text>
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
