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

    const redirectToDashboard = () => {
        router.push("/(tabs)/dashboard")
    }

    const redirectToRegisterPage = () => {
        router.push('/register');
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: keyboardVisible ? 'flex-start' : 'center',
                        paddingVertical: 40,
                    }}
                >
                    <View className="px-6">
                        <Text className="text-3xl font-bold text-center mb-6">Login</Text>

                        {error ? (
                            <Text className="text-red-600 text-center mb-4">{error}</Text>
                        ) : null}

                        <View className="mb-4">
                            <Text className="mb-1">Email</Text>
                            <TextInput
                                className="border border-slate-400 rounded-lg px-3 py-2"
                                value={username}
                                onChangeText={setUsername}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="mb-1">Password</Text>
                            <TextInput
                                className="border border-slate-400 rounded-lg px-3 py-2"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <Pressable
                            onPress={handleLogin}
                            className="bg-blue-600 py-3 rounded-lg mb-3 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white font-semibold text-center">Login</Text>
                            )}
                        </Pressable>

                        <Pressable onPress={redirectToRegisterPage}>
                            <Text className="text-blue-600 font-semibold text-center">
                                Belum punya akun? Register!
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
