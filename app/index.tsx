import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View, Image } from "react-native";
import { getUserSession } from '../utils/session';
import { FontAwesome5, Fontisto } from '@expo/vector-icons';

export default function Index() {
    const [userLoggedIn, setUserLoggedIn] = useState({});
    const [usernameLoggedIn, setUsernameLoggedIn] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1 for 1-12
    const currentYear = currentDate.getFullYear();

    const redirectToRegisterPage = () => {
        router.push("/register")
    }

    const redirectToLoginPage = () => {
        router.push("/login")
    }

    const redirectToDashboard = () => {
        router.push("/(tabs)/dashboard")
    }

    useEffect(() => {
        const checkSession = async () => {
            const user = await getUserSession();
            if (user && user !== null) {
                setIsLoggedIn(true);
                setUserLoggedIn(user);
                redirectToDashboard()
            }
        };

        checkSession();
    }, []);

    return (
        <View className='flex-1 justify-center items-center bg-white'>
            <View className='flex flex-row items-center mt-4 border-b-2'>
                <Image source={require('../assets/images/icon2.png')} className='w-12 h-12' />
                <Text className='font-bold ml-1 text-6xl'>MoniPlan</Text>
            </View>
            <Text className='italic text-black font-mono mt-1'>Smarter Planning for Every Expense.</Text>
            {
                !isLoggedIn ? (
                    <View className='flex flex-col mt-4'>
                        <Pressable onPress={redirectToLoginPage} className="bg-white px-6 py-2 rounded-lg mt-2 border border-b-[3px] border-r-[3px]">
                            <Text className="text-black font-semibold text-center">Get Started!</Text>
                        </Pressable>
                    </View>
                ) : (<></>)
            }
        </View >
    );
}
