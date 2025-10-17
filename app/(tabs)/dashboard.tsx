import { FontAwesome, FontAwesome5, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Categories, getDetailCategory } from '../models/categories';
import { Transactions } from '../models/transactions';

// SERVICES
import { createCategory, indexCategory, updateCategory } from '../services/categories';
import { deleteTransaction, indexTransaction } from '../services/transactions';
import { getCurrentDate, getDetailDate, redirectToDetailCategoryPage, setupLogout, showShortToast } from '@/utils/helper';

export default function Dashboard() {
  const { shouldRefreshData } = useLocalSearchParams();

  const currentDate = getCurrentDate()
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const monthLabel = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [categories, setCategories] = useState<Categories[]>([]);
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Categories>();
  const [refreshCategories, setRefreshCategories] = useState<boolean>(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(false);
  const [refreshTransactions, setRefreshTransactions] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transactions>();

  const [inputCategoryName, setInputCategoryName] = useState("");
  const [inputTotalBudget, setInputTotalBudget] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
  }, []);

  const detailCategorySheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentDetailCategoryModalPress = useCallback(() => {
    detailCategorySheetModalRef.current?.present();
  }, []);
  const handleSheetDetailCategoryChanges = useCallback((index: number) => {
  }, []);

  const deleteTransactionSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentDeleteTransactionModalPress = useCallback(() => {
    deleteTransactionSheetModalRef.current?.present();
  }, []);
  const handleSheetDeleteTransactionChanges = useCallback((index: number) => {
  }, []);

  const editCategorySheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentEditCategoryModalPress = useCallback(() => {
    editCategorySheetModalRef.current?.present();
  }, []);
  const handleSheetEditCategoryChanges = useCallback((index: number) => {
  }, []);

  const handleDeleteTransaction = async (transaction_id: string) => {
    const response = await deleteTransaction(transaction_id);
    if (!response.error) {
      setRefreshCategories(!refreshCategories)
      deleteTransactionSheetModalRef.current?.close()
      deleteTransactionSheetModalRef.current?.dismiss()
      showShortToast("Transaction deleted successfully!")
    }
  };

  const handleEditCategory = async () => {
    try {
      const response = await updateCategory(
        (selectedCategory?.id || ""), inputCategoryName, month, year, parseInt(inputTotalBudget)
      );
      if(!response.error) {
        setRefreshCategories(!refreshCategories)
        editCategorySheetModalRef.current?.close()
        editCategorySheetModalRef.current?.dismiss
        detailCategorySheetModalRef.current?.close()
        detailCategorySheetModalRef.current?.dismiss()
        showShortToast("Category successfully updated!")
      } else {
        showShortToast("Error in updating category!")
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    resetFormCategoryValue()
    setRefreshCategories(!refreshCategories)
  };

  const resetFormCategoryValue = () => {
    setInputCategoryName("")
    setInputTotalBudget("")
  }

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
    let category_details = getDetailCategory(category, transactions);
    setSelectedCategory(category_details)
    handlePresentDetailCategoryModalPress()
  }

  function showDeleteTransactionConfirmation(transaction: Transactions) {
    setSelectedTransaction(transaction)
    handlePresentDeleteTransactionModalPress()
  }

  function showEditCategoryForm() {
    setInputCategoryName(selectedCategory?.name || "");
    setInputTotalBudget(selectedCategory?.amount.toString() || "")
    detailCategorySheetModalRef.current?.close()
    detailCategorySheetModalRef.current?.dismiss()
    handlePresentEditCategoryModalPress()
  }

  async function handleAddCategory() {
    try {
      const response = await createCategory(
        inputCategoryName, month, year, parseInt(inputTotalBudget)
      );
      setRefreshCategories(!refreshCategories)
      bottomSheetModalRef.current?.close();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    resetFormCategoryValue()
    setRefreshCategories(!refreshCategories)
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
        setTotalCategory(data.length)
        setCategoriesLoaded(!categoriesLoaded)
      } catch (err) {
        console.error("Error fetching categories: ", err);
        setupLogout()
      }
    };

    loadCategories();
  }, [month, refreshCategories, shouldRefreshData]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await indexTransaction(month, year, 0);
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
        setTotalTransaction(data.length)
        setTotalIncome(totalIncome)
        setTotalExpense(totalExpense)
      } catch (err) {
        console.error("Error fetching transactions: ", err);
        setupLogout()
      }
    };

    fetchTransactions();
  }, [categoriesLoaded, refreshTransactions]);

  return (
    <GestureHandlerRootView className='flex-1'>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1 px-2 bg-white">
            <View className='mt-3 flex flex-row items-center justify-center'>
              <Pressable onPress={decreaseMonth} className='border border-black mx-1 my-1 px-3 py-1 border-b-[3px] border-l-[3px] rounded-lg'>
                <FontAwesome5 name="chevron-left" size={16} color="black" />
              </Pressable>
              <Text className='font-bold px-3'>{monthLabel[month - 1]} {year}</Text>
              <Pressable onPress={increaseMonth} className='border border-black mx-1 my-1 px-3 py-1 border-b-[3px] border-r-[3px] rounded-lg'>
                <FontAwesome5 name="chevron-right" size={16} color="black" />
              </Pressable>
            </View>
            <View className='flex flex-row items-center pt-3'>
              <Text className="text-lg font-bold">Categories ({totalCategory})</Text>
            </View>
            <View className='flex flex-row flex-wrap'>
              {categories?.length > 0 ? (
                categories.map((item) => ( // Use map here
                  <Pressable onPress={() => showDetailCategoryInfo(item)} key={item.id} className='border border-black mr-1 my-1 px-3 py-1 border-b-[3px] border-r-[3px] rounded-lg'>
                    <Text className='text-sm font-semibold'>{item.name.replaceAll("_", " ").toUpperCase()}</Text>
                  </Pressable>
                ))
              ) : (
                <></>
              )}
              <Pressable onPress={showFormAddCategory} className='flex justify-center items-center bg-white border border-black py-1 mx-1 my-1 px-3 border-b-[3px] border-r-[3px] rounded-lg'>
                <FontAwesome5 name="plus" size={12} color="black" />
              </Pressable>
            </View>
            <View className='flex flex-row items-center pt-3 justify-between pr-2'>
              <View className='flex flex-row items-center'>
                <Text className="text-lg font-bold">Transactions ({totalTransaction})</Text>
                <Pressable onPress={handleAddTransaction} className='border-2 border-black px-3 py-1 m-3 z-100 rounded-md'>
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
                  <Text className='text-red-600 font-bold'>Rp. {new Intl.NumberFormat().format(totalExpense)}</Text>
                </View>
              </View>
            </View>
            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
              {transactions?.length > 0 ? (
                transactions.map((item) => (
                  <Pressable key={item.id} className='flex flex-row justify-between border border-black mx-1 my-1 px-3 py-2 border-b-[3px] border-r-[3px] rounded-lg'>
                    <View className='flex flex-col border-[1px] items-center py-1 px-2 rounded-lg'>
                      <View className='flex flex-row items-center justify-between '>
                        <Fontisto name="date" size={20} color="black" />
                        <Text className='text-3xl ml-2 font-bold'>{getDetailDate(item.transaction_date || "")[1]}</Text>
                      </View>
                      <View className='flex flex-row items-center justify-between'>
                        <MaterialIcons name="access-time" size={20} color="black" />
                        <Text className='text-md ml-2 font-bold'>{getDetailDate(item.transaction_date || "")[4]}</Text>
                      </View>
                    </View>
                    <View className='flex flex-col flex-1 px-3 items-center justify-center'>
                      <Text className='text-xl font-semibold'>{item.category_name.replaceAll("_", " ").toUpperCase()}</Text>
                      <Text className='text-sm font-normal flex-wrap text-center' numberOfLines={1}>{item.remarks}</Text>
                      <View className='flex flex-row mt-1'>
                        <View className='flex flex-row items-center border border-b-[2px] border-r-[2px] rounded-lg px-2 py-1'>
                          <FontAwesome5 name="eye" size={12} color="black" />
                        </View>
                        <View className='flex flex-row ml-1 items-center border border-b-[2px] border-r-[2px] rounded-lg px-2 py-1'>
                          <FontAwesome5 name="edit" size={12} color="black" />
                        </View>
                        <Pressable onPress={() => showDeleteTransactionConfirmation(item)} key={item.id} className='flex flex-row ml-1 items-center border border-b-[2px] border-r-[2px] rounded-lg px-2 py-1'>
                          <MaterialIcons name="delete" size={12} color="black" />
                        </Pressable>
                      </View>
                    </View>
                    <View className='flex flex-wrap flex-col items-center justify-center'>
                      <MaterialCommunityIcons name={`${item.type.toLowerCase() == 'expense' ? 'arrow-up' : 'arrow-down'}`} size={20} color={`${item.type.toLowerCase() == 'expense' ? 'red' : 'green'}`} />
                      <Text className={`${item.type.toLowerCase() == 'expense' ? 'text-red-600' : 'text-green-800'} text-md font-bold`}>Rp.</Text>
                      <Text className={`${item.type.toLowerCase() == 'expense' ? 'text-red-600' : 'text-green-800'} text-2xl font-bold`}>{new Intl.NumberFormat().format(item.amount / 1000)}K</Text>
                    </View>
                  </Pressable>
                ))
              ) : (
                <></>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          enablePanDownToClose={true}
          backdropComponent={(props: any) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close" // 👈 this makes outside tap close the modal
            />
          )}
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
                    <Text className='text-slate-800 py-1 font-semibold'>Category Name</Text>
                    <BottomSheetTextInput
                      value={inputCategoryName}
                      onChangeText={setInputCategoryName}
                      className='border border-black rounded-lg text-black'
                    />
                  </View>

                  <View className='mt-2'>
                    <Text className='text-slate-800 py-1 font-semibold'>Total Budget (Rp)</Text>
                    <BottomSheetTextInput
                      value={inputTotalBudget}
                      onChangeText={setInputTotalBudget}
                      className='border border-black rounded-lg text-black'
                    />
                  </View>

                  <View className='flex flex-row justify-end mt-4'>
                    <Pressable onPress={handleAddCategory} className='border-2 border-black px-8 py-2 rounded-lg'>
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
          enablePanDownToClose={true}
          backdropComponent={(props: any) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close" // 👈 this makes outside tap close the modal
            />
          )}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <ScrollView
                className='px-2 mx-2 mt-2'
                keyboardShouldPersistTaps="handled"
              >
                <View className='flex flex-col pt-1 pb-5 px-3 bg-white z-20'>
                  <Text className='text-2xl font-bold text-center uppercase border-b-2'>
                    Detail Category
                  </Text>
                  <View className='mt-3'>
                    <Text className='text-slate-600 py-1'>Name</Text>
                    <Text className='font-bold text-2xl'>{selectedCategory?.name.toUpperCase()}</Text>
                  </View>
                  <View className='mt-1'>
                    <Text className='text-slate-600 py-1'>Total Budget</Text>
                    <Text className='font-bold text-2xl'>Rp. {new Intl.NumberFormat().format(selectedCategory ? selectedCategory.amount : 0)}</Text>
                  </View>
                  <View className='mt-1'>
                    <Text className='text-slate-600 py-1'>Remaining Budget</Text>
                    <Text className='font-bold text-2xl'>Rp. {new Intl.NumberFormat().format(selectedCategory ? selectedCategory.remaining_budget : 0)}</Text>
                  </View>
                  <View className='mt-1'>
                    <Text className='text-slate-600 py-1'>Total Transactions</Text>
                    <Text className='font-bold text-2xl'>{selectedCategory?.total_transaction} Transactions</Text>
                  </View>

                  <View className='mt-3 flex flex-row justify-center'>
                    <Pressable onPress={() => { redirectToDetailCategoryPage(selectedCategory?.id || "", selectedCategory?.name || "", selectedCategory?.amount || 0, selectedCategory?.remaining_budget || 0, selectedCategory?.total_transaction || 0) }} className='flex flex-row items-center border border-b-[3px] border-r-[3px] rounded-lg px-3 py-1'>
                      <FontAwesome5 name="eye" size={18} color="black" />
                      <Text className='ml-1 font-bold text-lg'>Detail</Text>
                    </Pressable>
                    <Pressable onPress={() => { showEditCategoryForm() }} className='flex flex-row ml-1 items-center border border-b-[3px] border-r-[3px] rounded-lg px-3 py-1'>
                      <FontAwesome5 name="edit" size={18} color="black" />
                      <Text className='ml-1 font-bold text-lg'>Edit</Text>
                    </Pressable>
                    <View className='flex flex-row ml-1 items-center border border-b-[3px] border-r-[3px] rounded-lg px-3 py-1'>
                      <MaterialIcons name="delete" size={18} color="black" />
                      <Text className='ml-1 font-bold text-lg'>Delete</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </BottomSheetView>
        </BottomSheetModal>
        <BottomSheetModal
          ref={deleteTransactionSheetModalRef}
          onChange={handleSheetDeleteTransactionChanges}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          enablePanDownToClose={true}
          backdropComponent={(props: any) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close" // 👈 this makes outside tap close the modal
            />
          )}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <ScrollView
                className='px-2 mx-2 mt-2'
                keyboardShouldPersistTaps="handled"
              >
                <View className='flex flex-col pt-1 pb-5 px-3 bg-white z-20'>
                  <Text className='text-2xl font-bold text-center uppercase border-b-2'>
                    Delete Confirmation!
                  </Text>
                  <View className='mt-3'>
                    <Text className='text-black py-1 text-center text-xl'>Are you sure you want to delete this transaction?</Text>
                    <View className='flex flex-row justify-center items-center mt-6'>
                      <Fontisto name='date' size={16} color="black"></Fontisto>
                      <Text className='ml-2 text-lg'>{selectedTransaction?.transaction_date}</Text>
                    </View>
                    <View className='flex flex-row justify-center items-center mt-1'>
                      <MaterialIcons name='category' size={16} color="black"></MaterialIcons>
                      <Text className='ml-2 text-lg'>{selectedTransaction?.category_name.toUpperCase()}</Text>
                    </View>
                    <View className='flex flex-row justify-center items-center mt-1'>
                      <FontAwesome name='money' size={16} color="black"></FontAwesome>
                      <Text className='ml-2 text-lg'>Rp. {new Intl.NumberFormat().format(selectedTransaction?.amount || 0)}</Text>
                    </View>
                  </View>
                  <View className='flex flex-row justify-center mt-6'>
                    <Pressable onPress={() => { handleDeleteTransaction(selectedTransaction?.id || "") }} className='flex flex-row ml-1 items-center border border-b-[3px] border-r-[3px] rounded-lg px-3 py-1'>
                      <FontAwesome name="check-square-o" size={18} color="black" />
                      <Text className='ml-1 font-bold text-lg'>Yes</Text>
                    </Pressable>
                    <Pressable onPress={() => { deleteTransactionSheetModalRef.current?.close }} className='flex flex-row ml-1 items-center border border-b-[3px] border-r-[3px] rounded-lg px-3 py-1'>
                      <FontAwesome name="close" size={18} color="black" />
                      <Text className='ml-1 font-bold text-lg'>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </BottomSheetView>
        </BottomSheetModal>
        <BottomSheetModal
          ref={editCategorySheetModalRef}
          onChange={handleSheetEditCategoryChanges}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          enablePanDownToClose={true}
          backdropComponent={(props: any) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close" // 👈 this makes outside tap close the modal
            />
          )}
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
                    Edit Category #{selectedCategory?.name}
                  </Text>

                  <View className='mt-4'>
                    <Text className='text-slate-800 py-1 font-semibold'>Category Name</Text>
                    <BottomSheetTextInput
                      value={inputCategoryName}
                      editable={false}
                      className='border border-black rounded-lg text-black'
                    />
                  </View>

                  <View className='mt-2'>
                    <Text className='text-slate-800 py-1 font-semibold'>Total Budget (Rp)</Text>
                    <BottomSheetTextInput
                      value={inputTotalBudget}
                      onChangeText={setInputTotalBudget}
                      className='border border-black rounded-lg text-black'
                    />
                  </View>

                  <View className='flex flex-row justify-end mt-4'>
                    <Pressable onPress={handleEditCategory} className='border-2 border-black px-8 py-2 rounded-lg'>
                      <Text className='text-black font-bold'>Save</Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
