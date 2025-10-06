import { getUserSession } from "@/utils/session";
import axios from "axios";

const BASE_URL = "http://192.168.1.28:8080"

type WhereFilterOp =
  "<" | "<=" | "==" | "!=" | ">=" | ">" |
  "array-contains" | "in" | "not-in" | "array-contains-any";

export const indexCategory = async (_month: Number, _year: Number) => {
  try {
    const user = await getUserSession()
    const response = await axios.get(BASE_URL + "/api/v1/category?month="+_month+"&year="+_year, {
      headers: {
        "Authorization": "Bearer " + user.token
      }
    });
    console.log("indexCategory: ", response.data)
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Index Category failed:", error.response.data);
      return error.response;
    }
    throw error;
  }
};

export const createCategory = async (_name: string, _month: Number, _year: Number, _amount: Number) => {
  try {
    const user = await getUserSession()
    const response = await axios.post(BASE_URL + "/api/v1/category/create", {
      name: _name, month: _month, year: _year, amount: _amount
    }, {
      headers: {
        "Authorization": "Bearer " + user.token
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Create Category failed:", error.response.data);
      throw new Error(error.response.data.message || "Create Category failed");
    }
    throw error;
  }
};
