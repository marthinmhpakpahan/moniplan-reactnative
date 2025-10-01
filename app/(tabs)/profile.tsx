import { getUserSession } from '@/utils/session';
import { View, Text } from 'react-native';
import { Users } from '../models/Users';
import { useEffect, useState } from 'react';

export default function Profile() {
  
  const [user, setUser] = useState<Users>();

  useEffect(() => {
    const loadCategories = async () => {
      const user = await getUserSession();
      setUser(user);
    };

    loadCategories();
  }, [user]);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">Welcome { user?.name }</Text>
    </View>
  );
}
