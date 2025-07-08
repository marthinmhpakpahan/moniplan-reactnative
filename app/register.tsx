import { router } from 'expo-router';
import React, { use, useEffect, useState } from 'react';
import {
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function Register() {
  const [full_name, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone_no, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const redirectToLoginPage = () => {
    router.push('/login');
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, "users"), {
        full_name: full_name,
        username: username,
        password: password,
        email: email,
        phone_no: phone_no
      });
      redirectToLoginPage()
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  if (loading) {
    return <View className='flex-1 justify-center items-center'><Text>Loading...</Text></View>;
  }

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
            <Text className="text-3xl font-bold text-center mb-6">Register Page!</Text>

            <View className="mb-4">
              <Text className="mb-1">Full Name</Text>
              <TextInput
                className="border border-slate-400 rounded-lg px-3 py-2"
                value={full_name}
                onChangeText={setFullName}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-1">Email</Text>
              <TextInput
                className="border border-slate-400 rounded-lg px-3 py-2"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-1">Phone No</Text>
              <TextInput
                className="border border-slate-400 rounded-lg px-3 py-2"
                value={phone_no}
                onChangeText={setPhoneNo}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-1">Username</Text>
              <TextInput
                className="border border-slate-400 rounded-lg px-3 py-2"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View className="mb-6">
              <Text className="mb-1">Password</Text>
              <TextInput
                className="border border-slate-400 rounded-lg px-3 py-2"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
              />
            </View>

            <Pressable onPress={handleRegister} className="bg-blue-600 py-3 rounded-lg mb-3">
              <Text className="text-white font-semibold text-center">Register</Text>
            </Pressable>

            <Pressable onPress={redirectToLoginPage}>
              <Text className="text-blue-600 font-semibold text-center">
                Sudah punya akun? Login!
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
