import { BASE_URL, redirectToDashboard } from "@/utils/helper";
import { getUserSession, removeUserSession } from "@/utils/session";
import axios from "axios";

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
    return response.data;
  } catch (error: any) {
    console.error("Index Category failed:", error.response.data);
    removeUserSession()
    redirectToDashboard()
    throw error;
  }
};

export const createCategory = async (_name: string, _month: Number, _year: Number, _amount: Number, _remarks: string) => {
  try {
    const user = await getUserSession()
    const response = await axios.post(BASE_URL + "/api/v1/category/create", {
      name: _name, month: _month, year: _year, amount: _amount, remarks: _remarks
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

export const updateCategory = async (_category_id: string, _name: string, _month: Number, _year: Number, _amount: Number) => {
  try {
    const user = await getUserSession()
    const response = await axios.post(BASE_URL + "/api/v1/category/update/"+_category_id, {
      category_id: _category_id, name: _name, month: _month, year: _year, amount: _amount
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
