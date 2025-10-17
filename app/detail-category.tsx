import { getUserSession } from '@/utils/session';
import { FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Categories } from './models/categories';
import { indexCategory } from './services/categories';
import { formatCurrency, formatDate, formatDateAPI, formatTime, getCurrentDate, getCurrentTime, getDetailDate, getRandomInt, redirectToDashboard, showShortToast } from '@/utils/helper';
import { createTransaction, deleteTransaction, indexTransaction } from './services/transactions';
import { Transactions } from './models/transactions';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';

export default function DetailCategory() {

    const { id, name, amount, remaining_budget, total_transaction } = useLocalSearchParams();
    const [transactions, setTransactions] = useState<Transactions[]>([]);
    const currentDate = getCurrentDate()
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const monthLabel = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const [selectedTransaction, setSelectedTransaction] = useState<Transactions>();
    const deleteTransactionSheetModalRef = useRef<BottomSheetModal>(null);
    const handlePresentDeleteTransactionModalPress = useCallback(() => {
        deleteTransactionSheetModalRef.current?.present();
    }, []);
    const handleSheetDeleteTransactionChanges = useCallback((index: number) => {
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await indexTransaction(currentMonth, currentYear, parseInt(id.toString()));
                const data = response.data || [];
                console.log(data.length)
                setTransactions(data);
                console.log(transactions.length)
            } catch (err) {
                console.error("Error fetching transactions: ", err);
            }
        };

        fetchTransactions();
    }, []);

    function showDeleteTransactionConfirmation(transaction: Transactions) {
        setSelectedTransaction(transaction)
        handlePresentDeleteTransactionModalPress()
    }

    const handleDeleteTransaction = async (transaction_id: string) => {
        const response = await deleteTransaction(transaction_id);
        if (!response.error) {
            showShortToast("Transaction deleted successfully!")
            redirectToDashboard()
        }
    };

    return (
        <GestureHandlerRootView className='flex-1'>
            <BottomSheetModalProvider>
                <SafeAreaView className="flex-1 bg-white">
                    <View className='flex-1 flex-col'>
                        <View className='flex flex-row items-center mt-8 pb-3 px-2 border-b-2 border-gray-500'>
                            <Pressable onPress={redirectToDashboard} className='px-2 py-1'>
                                <FontAwesome5 name="arrow-left" size={24} />
                            </Pressable>
                            <Text className='ml-4 text-xl font-bold'>Detail Category #{id}</Text>
                        </View>
                        <View className='flex flex-col mt-4 px-3'>
                            <Text className='text-sm font-semibold'>ID Category</Text>
                            <Text className='ml-2 text-3xl font-bold'>#{id.toString().toUpperCase()}</Text>
                        </View>
                        <View className='flex flex-col mt-2 px-3'>
                            <Text className='text-sm font-semibold'>Category Name</Text>
                            <Text className='ml-2 text-3xl font-bold'>{name.toString().toUpperCase()}</Text>
                        </View>
                        <View className='flex flex-col mt-2 px-3'>
                            <Text className='text-sm font-semibold'>Total Budget</Text>
                            <Text className='ml-2 text-3xl font-bold'>Rp. {formatCurrency(parseInt(amount.toString()))}</Text>
                        </View>
                        <View className='flex flex-col mt-2 px-3'>
                            <Text className='text-sm font-semibold'>Remaining Budget</Text>
                            <Text className='ml-2 text-3xl font-bold'>Rp. {formatCurrency(parseInt(remaining_budget.toString()))}</Text>
                        </View>
                        <View className='flex flex-col mt-2 px-3'>
                            <Text className='text-sm font-semibold'>Total Transactions</Text>
                            <Text className='ml-2 text-3xl font-bold'>{total_transaction} Transactions</Text>
                        </View>
                        <View className='flex-1 flex-col mt-6 px-3'>
                            <View className='flex flex-row items-center'>
                            <MaterialIcons name="view-list" size={22} color="black" />
                                <Text className='ml-1 text-2xl font-bold'>Transactions</Text>
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
                                    <><Text>No Transactions!</Text></>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </SafeAreaView>
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
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}
