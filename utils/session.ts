import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'users';

/**
 * Save user session to AsyncStorage
 * @param user Object containing user data
 */
export const saveUserSession = async (user: any) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user session:', error);
  }
};

/**
 * Get user session from AsyncStorage
 * @returns Parsed user object or null
 */
export const getUserSession = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading user session:', error);
    return null;
  }
};

/**
 * Remove user session from AsyncStorage
 */
export const removeUserSession = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user session:', error);
  }
};
