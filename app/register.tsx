import { router } from 'expo-router';
import { use, useEffect, useState } from 'react';
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
import { register } from './services/users';

export default function Register() {
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
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
      const response = await register(full_name, email, password)
      if(response.token) {
        redirectToLoginPage()
      }
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
        className='bg-white'
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: keyboardVisible ? 'flex-start' : 'center',
            paddingVertical: 40,
          }}
        >
          <View className="px-6 bg-white">
            <Text className="text-3xl font-bold text-center mb-6">Register Your Account!</Text>

            <View className="mb-4">
              <Text className="mb-1">Full Name</Text>
              <TextInput
                className="border border-black py-2 my-1 px-3 rounded-lg text-black"
                value={full_name}
                onChangeText={setFullName}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-1">Email</Text>
              <TextInput
                className="border border-black py-2 my-1 px-3 rounded-lg text-black"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="mb-6">
              <Text className="mb-1">Password</Text>
              <TextInput
                className="border border-black py-2 my-1 px-3 rounded-lg text-black"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
              />
            </View>

            <Pressable onPress={handleRegister} className="flex justify-center items-center bg-white border border-black py-2 my-1 px-3 border-b-[3px] border-r-[3px] rounded-lg">
              <Text className="text-black font-bold text-center">REGISTER</Text>
            </Pressable>

            <Pressable onPress={redirectToLoginPage}>
              <Text className="text-black font-semibold text-center">
                Already have account? Login here!
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
