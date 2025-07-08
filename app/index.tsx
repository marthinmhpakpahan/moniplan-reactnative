import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from "react-native";
import { getUserSession } from '../utils/session';

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
            console.log("users", user)
            if (user && user !== null) {
                console.log(user)
                setIsLoggedIn(true);
                setUserLoggedIn(user);
                redirectToDashboard()
            }
        };

        checkSession();
    }, []);

    return (
        <View className='flex-1 justify-center items-center'>
            <Text className='text-2xl font-bold'>Index Page!</Text>
            {
                !isLoggedIn ? (
                    <View className='flex flex-col'>
                        <Pressable onPress={redirectToLoginPage} className="bg-blue-500 px-4 py-2 rounded-lg mt-2">
                            <Text className="text-white font-semibold text-center">Login</Text>
                        </Pressable>
                        <Pressable onPress={redirectToRegisterPage} className="bg-blue-500 px-4 py-2 rounded-lg mt-2">
                            <Text className="text-white font-semibold text-center">Register</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View>
                        <Pressable onPress={redirectToDashboard} className="bg-blue-500 px-4 py-2 rounded-lg mt-2">
                            <Text className="text-white font-semibold">Go to Dashboard</Text>
                        </Pressable>
                    </View>
                )
            }
        </View >
    );
}
