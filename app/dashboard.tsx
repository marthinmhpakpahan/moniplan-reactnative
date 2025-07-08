import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View, Pressable } from "react-native";
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';


export default function Index() {
    const handleAddTransaction = async () => {
        try {
            await addDoc(collection(db, "categories"), {
                user_id: "TestingUserID",
                name: "HouseHold",
                created_date: new Date(),
            });
            alert("Transaction added!");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const redirectToRegisterPage = () => {
        router.push("/register")
    }

    const redirectToLoginPage = () => {
        router.push("/login")
    }

    return (
        <View className='flex-1 justify-center items-center'>
            <Text className='text-2xl font-bold'>Index Page!</Text>
        </View>
    );
}
