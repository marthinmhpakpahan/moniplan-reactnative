import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { removeUserSession } from '../../utils/session';

export default function TabLayout() {

  const redirectToLoginPage = () => {
    router.push("/login")
  }

  function handleLogout() {
    removeUserSession()
    redirectToLoginPage()
  }

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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text className='font-bold text-xl'>MoniPlan</Text>
          </View>
        ),
        headerRight: () => (
          <Pressable onPress={handleLogout} style={{ marginRight: 12 }}>
            <MaterialCommunityIcons name="logout" size={32} color="black" />
          </Pressable>
        ),
      })}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="summary" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
