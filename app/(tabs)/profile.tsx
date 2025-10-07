import { getUserSession, removeUserSession } from '@/utils/session';
import { View, Text, Pressable } from 'react-native';
import { Users } from '../models/users';
import { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { redirectToLoginPage } from '@/utils/helper';

export default function Profile() {

  const [user, setUser] = useState<Users>();

  useEffect(() => {
    const loadCategories = async () => {
      const user = await getUserSession();
      setUser(user);
    };

    loadCategories();
  }, [user]);

  function handleLogout() {
    removeUserSession()
    redirectToLoginPage()
  }

  return (
    <View className="flex-1 flex-col items-center justify-center">
      <Text className="text-xl font-bold">Welcome {user?.name}</Text>
      <Pressable onPress={handleLogout} className='flex flex-row items-center py-1 px-4 border border-b-[3px] border-r-[3px] rounded-lg mt-4'>
        <MaterialCommunityIcons name="logout" size={20} color="black" />
        <Text className='font-semibold text-xl ml-1'>Logout</Text>
      </Pressable>
    </View>
  );
}
