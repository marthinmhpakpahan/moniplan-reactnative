import { getUserSession } from '@/utils/session';
import { FontAwesome5, Fontisto, Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Modal, Platform, Pressable, Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Categories } from './models/categories';
import { indexCategory } from './services/categories';
import { formatDate, getCurrentDate, getCurrentTime, getRandomInt } from '@/utils/helper';
import { createTransaction } from './services/transactions';

export default function CreateTransaction() {
    const currentDate = getCurrentDate()
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentTime = getCurrentTime()

    const [categoryID, setCategoryID] = useState("")
    const [categoryName, setCategoryName] = useState("")
    const [categories, setCategories] = useState<Categories[]>([]);

    const [date, setDate] = useState(currentDate);
    const [time, setTime] = useState(currentTime);
    const [amount, setAmount] = useState(0);
    const [remarks, setRemarks] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const onChangeDatePicker = (event: any, selectedDate?: Date) => {
        let _currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios'); // iOS keeps picker open
        setDate(_currentDate);
    };

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
                    <Pressable onPress={redirectToDashboard} className='px-2 py-1'>
                        <FontAwesome5 name="arrow-left" size={24} />
                    </Pressable>
                    <Text className='ml-4 text-xl font-bold'>Create Transaction</Text>
                </View>
                <View className='flex flex-row items-end mt-4 px-3 '>
                    <Text className='col-start-1 col-span-2 mr-2 w-24 text-slate-600'>Date</Text>
                    <View className='grow mx-2'>
                        <View className='flex flex-row items-end'>
                            <Fontisto name="date" size={20} color="black" />
                            <TextInput showSoftInputOnFocus={false} value={formatDate(date)} onPress={() => { setShowDatePicker(true) }} className='col-start-1 grow col-span-4 font-bold border-b border-slate-400 w-max pb-[1px] pt-4 text-black ml-1'></TextInput>
                        </View>
                    </View>
                    <View className='grow mx-2'>
                        <View className='flex flex-row items-end'>
                            <MaterialIcons name="access-time" size={20} color="black" />
                            <TextInput showSoftInputOnFocus={false} value={time} onPress={() => { setShowTimePicker(true) }} className='col-start-1 grow col-span-4 font-bold border-b border-slate-400 w-max pb-[1px] pt-4 text-black ml-1'></TextInput>
                        </View>
                    </View>
                </View>
                <View className='flex flex-row items-end mt-4 px-3 '>
                    <Text className='col-start-1 col-span-2 mr-2 w-24 text-slate-600'>Amount</Text>
                    <TextInput value={amount.toString() == "0" || amount.toString() == "" ? "0" : amount.toString()} onChangeText={text => setAmount(parseInt(text == "0" || text == "" ? "0" : text))} className='col-start-1 grow col-span-4 font-bold border-b border-slate-400 w-max pb-[1px] pt-4 text-black'></TextInput>
                </View>
                <View className='flex flex-row items-end mt-4 px-3 '>
                    <Text className='col-start-1 col-span-2 mr-2 w-24 text-slate-600'>Category</Text>
                    <TextInput showSoftInputOnFocus={false} caretHidden={true} value={categoryName.toUpperCase()} onPress={() => setModalVisible(true)} className='col-start-1 grow col-span-4 font-bold border-b border-slate-400 w-max pb-[1px] pt-4'></TextInput>
                </View>
                <View className='flex flex-row items-end mt-4 px-3 '>
                    <Text className='col-start-1 col-span-2 mr-2 w-24 text-slate-600'>Note</Text>
                    <TextInput multiline numberOfLines={5} textAlignVertical="top" value={remarks} onChangeText={text => setRemarks(text)} className='col-start-1 flex-1 text-wrap col-span-4 font-bold border-[1px] border-slate-400 h-[100px] text-black'></TextInput>
                </View>
                <View className='flex flex-row mt-6 px-3 justify-end'>
                    <Pressable className='flex flex-row items-center border border-black mx-1 my-1 px-3 py-1 border-b-[3px] border-r-[3px]'>
                        <Ionicons name="reload-circle-outline" size={13} color="black" />
                        <Text className='font-bold ml-2'>Reset Form</Text>
                    </Pressable>
                    <Pressable onPress={handleSaveButton} className='flex flex-row items-center border border-black mx-1 my-1 px-3 py-1 border-b-[3px] border-r-[3px]'>
                        <FontAwesome5 name="save" size={13} color="black" />
                        <Text className='font-bold ml-2'>Save</Text></Pressable>
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
            {showTimePicker && (
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
                    <View className='flex flex-col border bg-white w-2/3 border-b-[5px] border-t-[2px] border-l-[2px] border-r-[2px]'>
                        <Text className='text-center my-6 font-bold text-2xl uppercase'>Select Category</Text>
                        <View className='flex flex-col border-t-[2px]'>
                            {categories.length > 0 ? (
                                categories.map((item) => ( // Use map here
                                    <Pressable onPress={() => { setSelectedCategory(item.id, item.name) }} key={item.id} className='px-3 py-3 border-b-[1px] border-slate-400'>
                                        <Text className='text-center text-lg font-bold'>{item.name.toUpperCase()} ({item.amount.toString().length <= 6 ? item.amount.toString().slice(0, -3) + "K" : item.amount.toString().slice(0, -6) + "M"})</Text>
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
