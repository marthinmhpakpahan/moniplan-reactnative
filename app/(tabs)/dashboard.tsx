import { FontAwesome5 } from '@expo/vector-icons';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { getUserSession } from '@/utils/session';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Categories } from '../models/categories';

export default function Dashboard() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthLabel = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [categories, setCategories] = useState<Categories[]>([]);
  const [refreshCategories, setRefreshCategories] = useState<boolean>(false);

  const [categoryName, setCategoryName] = useState("");
  const [totalBudget, setTotalBudget] = useState("");

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
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

  async function handleAddCategory() {
    try {
      const user = await getUserSession();
      console.log(user)
      await addDoc(collection(db, "categories"), {
        user_id: user.id,
        name: categoryName,
        budget: totalBudget,
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categories: Categories[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            user_id: data.user_id,
            name: data.name,
            budget: data.budget
          };
        });
        setCategories(categories);
      } catch (err) {
        console.error("Error fetching categories: ", err);
      }
    };

    fetchCategories();
  }, [refreshCategories]);

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
      <View className='flex flex-row items-center py-3'>
        <Text className="text-lg font-bold">Categories</Text>
        <Pressable onPress={showFormAddCategory} className='border border-black mx-1 my-1 px-3 py-1 border-b-[3px] border-r-[3px]'>
          <FontAwesome5 name="plus" size={16} color="black" />
        </Pressable>
      </View>
      <View className='flex flex-row flex-wrap'>
        {categories.length > 0 ? (
          categories.map((item) => ( // Use map here
            <View key={item.id} className='border border-black mx-1 my-1 px-3 py-1 border-b-[3px] border-r-[3px]'>
              <Text>{item.name} ({item.budget.length <= 6 ? item.budget.slice(0, -3) + "K" : item.budget.slice(0, -6) + "M"})</Text>
            </View>
          ))
        ) : (
          <></>
        )}
      </View>
      <TouchableOpacity className='absolute bottom-0 right-0 border-2 border-black rounded-xl p-4 m-3'>
          <Text><FontAwesome5 name="plus" size={24} color="black"></FontAwesome5></Text>
        </TouchableOpacity>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <View className="flex-1 px-2">
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
                      <Text className='text-lg font-bold text-center'>
                        Add New Category with Budget!
                      </Text>

                      <View className='mt-4'>
                        <Text className='text-slate-600 py-1'>Category Name</Text>
                        <BottomSheetTextInput
                          value={categoryName}
                          onChangeText={setCategoryName}
                          className='border border-slate-200 rounded-lg'
                        />
                      </View>

                      <View className='mt-2'>
                        <Text className='text-slate-600 py-1'>Total Budget (Rp)</Text>
                        <BottomSheetTextInput
                          value={totalBudget}
                          onChangeText={setTotalBudget}
                          className='border border-slate-200 rounded-lg'
                        />
                      </View>

                      <View className='flex flex-row justify-end mt-4'>
                        <Pressable
                          onPress={handleAddCategory}
                          className='border border-white w-max px-10 py-2 rounded-xl bg-green-600'
                        >
                          <Text className='text-white font-bold'>Save</Text>
                        </Pressable>
                      </View>
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>

    </View>
  );
}
