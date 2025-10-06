import { getUserSession } from '@/utils/session';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Platform, Pressable, Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Categories } from './models/Categories';
import { indexCategory } from './services/categories';
import { getCurrentDate, getRandomInt } from '@/utils/helper';
import { createTransaction } from './services/transactions';

export default function CreateTransaction() {
    const currentDate = getCurrentDate()
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const [categoryID, setCategoryID] = useState("")
    const [categoryName, setCategoryName] = useState("")
    const [categories, setCategories] = useState<Categories[]>([]);
    const monthLabel = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const [date, setDate] = useState(currentDate);
    console.log("Create Transaction current date: ", formatDate(currentDate));
    const [amount, setAmount] = useState(0);
    const [remarks, setRemarks] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChangeDatePicker = (event: any, selectedDate?: Date) => {
        let _currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios'); // iOS keeps picker open
        setDate(_currentDate);
    };

    function formatDate(value: Date) {
        return value.getDate() + " " + monthLabel[value.getMonth()] + " " + value.getFullYear()
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await indexCategory(currentMonth, currentYear)
                setCategories(response.data);
            } catch (err) {
                console.error("Error fetching categories: ", err);
            }
        };

        fetchCategories();
    }, []);

    const setSelectedCategory = (key: any, value: any) => {
        setCategoryID(key)
        setCategoryName(value)
        setModalVisible(false)
        console.log("setSelectedCategory", key, value)
    };

    const redirectToDashboard = () => {
        router.push({
            pathname: "/(tabs)/dashboard",
            params: {
                shouldRefreshData: getRandomInt(1, 100),
            },
        });
    }

    async function handleSaveButton() {
        let is_valid = true;
        if (amount === 0 || categoryID === "") {
            is_valid = false;
            Alert.alert("Warning!", "Please fill the required fields!")
        }

        if (is_valid) {
            console.log("Save button triggered!")
            try {
                const user = await getUserSession();
                try {
                    const response = await createTransaction(
                        parseInt(categoryID), amount, "Expense", remarks
                    );

                    if (!response.error) {
                        redirectToDashboard()
                    }
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            } catch (e) {
                Alert.alert("ERROR", "Error happened!")
            }
        }
    }

    return (
        <GestureHandlerRootView>
            <View className='flex flex-col'>
                <View className='flex flex-row items-center mt-8 pb-3 px-2 border-b-2 border-gray-500'>
                    <Pressable onPress={redirectToDashboard} className='border px-2 py-1'>
                        <FontAwesome5 name="arrow-left" size={24} />
                    </Pressable>
                    <Text className='ml-4 text-xl font-bold'>Create Transaction</Text>
                </View>
                <View className='flex flex-row items-end mt-4 px-3 '>
                    <Text className='col-start-1 col-span-2 mr-2 w-24 text-slate-600'>Date</Text>
                    <TextInput value={formatDate(date)} onPress={() => { setShowDatePicker(true) }} className='col-start-1 grow col-span-4 border-b border-slate-400 w-max pb-[1px] pt-4'></TextInput>
                </View>
                <View className='flex flex-row items-end mt-4 px-3 '>
                    <Text className='col-start-1 col-span-2 mr-2 w-24 text-slate-600'>Amount</Text>
                    <TextInput value={amount.toString() == "0" || amount.toString() == "" ? "0" : amount.toString()} onChangeText={text => setAmount(parseInt(text == "0" || text == "" ? "0" : text))} className='col-start-1 grow col-span-4 border-b border-slate-400 w-max pb-[1px] pt-4'></TextInput>
                </View>
                <View className='flex flex-row items-end mt-4 px-3 '>
                    <Text className='col-start-1 col-span-2 mr-2 w-24 text-slate-600'>Category</Text>
                    <TextInput value={categoryName} onPress={() => setModalVisible(true)} className='col-start-1 grow col-span-4 border-b border-slate-400 w-max pb-[1px] pt-4'></TextInput>
                </View>
                <View className='flex flex-row items-end mt-4 px-3 '>
                    <Text className='col-start-1 col-span-2 mr-2 w-24 text-slate-600'>Note</Text>
                    <TextInput value={remarks} onChangeText={text => setRemarks(text)} className='col-start-1 grow col-span-4 border-b border-slate-400 w-max pb-[1px] pt-4'></TextInput>
                </View>
                <View className='flex flex-row mt-6 px-3 justify-end'>
                    <Pressable onPress={handleSaveButton} className='border-1 border-slate-300 px-8 py-2 mr-1 bg-green-500'><Text className='text-center text-white'>Save</Text></Pressable>
                    <Pressable className='border px-8 py-2 ml-1 border-slate-400'><Text>New</Text></Pressable>
                </View>
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date" // 'date' | 'time' | 'datetime'
                    display="default" // 'default' | 'spinner' | 'calendar' | 'clock'
                    onChange={onChangeDatePicker}
                />
            )}
            <Modal
                animationType="slide" // Or "fade", "none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} // For Android back button
            >
                <View className='flex-1 items-center justify-center '>
                    <View className='flex flex-col border bg-white w-2/3'>
                        <Text className='text-center my-6 font-bold text-xl'>Select Category!</Text>
                        <View className='flex flex-col'>
                            {categories.length > 0 ? (
                                categories.map((item) => ( // Use map here
                                    <Pressable onPress={() => { setSelectedCategory(item.id, item.name) }} key={item.id} className='px-3 py-3 border-[1px] border-slate-200'>
                                        <Text className='text-center text-lg'>{item.name} ({item.amount.toString().length <= 6 ? item.amount.toString().slice(0, -3) + "K" : item.amount.toString().slice(0, -6) + "M"})</Text>
                                    </Pressable>
                                ))
                            ) : (
                                <></>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
    );
}
