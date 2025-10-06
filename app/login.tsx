import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { saveUserSession } from '../utils/session';
import { login } from './services/users';
import { redirectToDashboard, redirectToRegisterPage } from '@/utils/helper';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await login(username, password)
            console.log("handleLogin", response)
            const user = response.user;
            if (response.token) {
                user.token = response.token;
                saveUserSession(user)
                redirectToDashboard()
            }
        } catch (err) {
            setError('Terjadi kesalahan saat login.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    className='bg-white'
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: keyboardVisible ? 'flex-start' : 'center',
                        paddingVertical: 40,
                    }}
                >
                    <View className="px-6 bg-white">
                        <Text className="text-4xl font-bold text-center mb-6">Login</Text>

                        {error ? (
                            <Text className="text-red-600 text-center mb-4">{error}</Text>
                        ) : null}

                        <View className="mb-4">
                            <Text className="mb-1 text-black">Email</Text>
                            <TextInput
                                className="border border-black rounded-lg px-3 py-2 bg-white"
                                value={username}
                                onChangeText={setUsername}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="mb-1 text-black">Password</Text>
                            <TextInput
                                className="border border-black rounded-lg px-3 py-2 bg-white"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <Pressable
                            onPress={handleLogin}
                            className="flex justify-center items-center bg-white border border-black py-2 my-1 px-3 border-b-[3px] border-r-[3px] rounded-lg mb-3 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text className="text-black font-bold text-center">Login</Text>
                            )}
                        </Pressable>

                        <Pressable onPress={redirectToRegisterPage}>
                            <Text className="text-black font-semibold text-center">
                                Don't have account? Register here!
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
