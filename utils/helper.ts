import { router } from "expo-router";

export const BASE_URL = "https://api.moniplan.halomoan.id"
const monthLabel = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export const getCurrentDate = () => {
    const currentDate = new Date();
    currentDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    return currentDate
  };

export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export const formatDate = (value: Date) => {
    return value.getDate() + " " + monthLabel[value.getMonth()] + " " + value.getFullYear()
}

export const getDetailDate = (value: string) => {
  return value.split(" ")
}

export const redirectToDashboard = () => {
  router.push("/(tabs)/dashboard")
}

export const redirectToRegisterPage = () => {
  router.push('/register');
};

export const isEmptyPlainObject = (obj: any) => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj.constructor === Object &&
    Object.keys(obj).length === 0
  );
}