import { FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { removeUserSession } from '../../utils/session';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: 'white',
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'dashboard') iconName = 'home';
          else if (route.name === 'summary') iconName = 'th-list';
          else if (route.name === 'profile') iconName = 'user-alt';

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        headerTitle: () => (
          <View className='flex flex-row items-center'>
            <Fontisto name="money-symbol" size={24} color="black" />
            <Text className='font-bold ml-1 text-4xl'>MoniPlan</Text>
          </View>
        ),
      })}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="summary" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
