import { router } from "expo-router";
import { ToastAndroid } from "react-native";
import { removeUserSession } from "./session";

export const BASE_URL = "https://api.moniplan.halomoan.id";
const monthLabel = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export const getCurrentDate = () => {
	const currentDate = new Date();
	currentDate.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
	return currentDate;
};

export const getCurrentTime = () => {
	const currentDate = new Date();
	currentDate.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
	return currentDate;
};

export const getRandomInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatDate = (value: Date) => {
	return (
		value.getDate() +
		" " +
		monthLabel[value.getMonth()] +
		" " +
		value.getFullYear()
	);
};

export const formatDateAPI = (value: Date) => {
	let month =
		value.getMonth() + 1 < 10
			? "0" + (value.getMonth() + 1)
			: value.getMonth() + 1;
	let date = value.getDate() < 10 ? "0" + value.getDate() : value.getDate();
	return value.getFullYear() + "-" + month + "-" + date;
};

export const formatTime = (value: Date) => {
	value.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
	const hours = value.getHours();
	let parsed_hours = hours < 10 ? "0" + hours : "" + hours;
	let minutes = value.getMinutes();
	let parsed_minutes = minutes < 10 ? "0" + minutes : "" + minutes;
	let seconds = value.getSeconds();
	let parsed_seconds = seconds < 10 ? "0" + seconds : "" + seconds;
	return parsed_hours + ":" + parsed_minutes + ":" + parsed_seconds;
};

export const convertObjectToParams = (obj : any) => {
	let keys = Object.keys(obj);
	let formatted_params = "";
	for(let index=0; index<keys.length; index++) {
		let value = obj[keys[index]]
		if(formatted_params != "") {
			formatted_params += "&"
		}
		formatted_params += (keys[index] + "=" + value)
	}
	return formatted_params
}

export const formatCurrency = (value: number) => {
	return new Intl.NumberFormat().format(value);
}

export const formatCategoryName = (value: string) => {
	let formatted_value = "";
	if(value != "") {
		formatted_value = value.replaceAll("_", " ")
	}
	return formatted_value.toUpperCase();
}

export const getDetailDate = (value: string) => {
	return value.split(" ");
};

export const redirectToDashboard = () => {
	router.push("/(tabs)/dashboard");
};

export const redirectToRegisterPage = () => {
	router.push("/register");
};

export const redirectToDetailCategoryPage = (id: string, name: string, amount: number, remaining_budget: number, total_transaction: number) => {
	router.push(`/detail-category?id=${id}&name=${name}&amount=${amount}&remaining_budget=${remaining_budget}&total_transaction=${total_transaction}`);
};

export const redirectToLoginPage = () => {
	router.push("/login");
};

export const redirectToEditTransactionPage = (transaction : any) => {
	let params = encodeURI(convertObjectToParams(transaction))
	let encodedParams = encodeURI(params).replace(/&/g, '%26')
	params = new URLSearchParams(transaction).toString()
	let url = "/update-transaction?" + params as any
	router.push(url)
}

export const setupLogout = () => {
	removeUserSession()
	router.push("/");
};

export const isEmptyPlainObject = (obj: any) => {
	return (
		typeof obj === "object" &&
		obj !== null &&
		obj.constructor === Object &&
		Object.keys(obj).length === 0
	);
};

export const showShortToast = (message: string) => {
	ToastAndroid.show(message, ToastAndroid.SHORT);
};

export const showLongToast = (message: string) => {
	ToastAndroid.show(message, ToastAndroid.LONG);
};
