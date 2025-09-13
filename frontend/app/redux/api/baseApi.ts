
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import axios, { AxiosRequestConfig } from "axios";
import { RootState } from "../featuers/store";
import { setUser, logout } from "./auth/authSlice";
import { tagTypesList } from "@/app/types/tag-types";

export const baseAPI = "https://api.promaxs.oi/api/v1";
// export const baseAPI = "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: baseAPI,
  withCredentials: true,
});

// Base Query using Axios with token handling and refresh logic
const axiosBaseQuery: BaseQueryFn<FetchArgs | string, unknown, unknown> = async (
  args,
  api,
  extraOptions
) => {
  const { getState, dispatch } = api;
  const token = (getState() as RootState).auth.token;

  if (token) {
    axiosInstance.defaults.headers.common["authorization"] = `${token}`;
  }

  try {
    const response = await axiosInstance({
      url: typeof args === "string" ? args : args.url,
      method: typeof args !== "string" ? args.method : "GET",
      data: typeof args !== "string" ? args.body : undefined,
      params: typeof args !== "string" ? args.params : undefined,
      ...extraOptions,
    } as AxiosRequestConfig);

    return { data: response.data };
  } catch (error: any) {
    // Token expired or unauthorized
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axiosInstance.post(
          `${baseAPI}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data?.data;
        if (newToken) {
          const user = (getState() as RootState).auth.user;
          dispatch(setUser({ user, token: newToken }));
          axiosInstance.defaults.headers.common["authorization"] = `${newToken}`;

          // Retry the original request with the new token
          const retryResponse = await axiosInstance({
            url: typeof args === "string" ? args : args.url,
            method: typeof args !== "string" ? args.method : "GET",
            data: typeof args !== "string" ? args.body : undefined,
            params: typeof args !== "string" ? args.params : undefined,
            ...extraOptions,
          } as AxiosRequestConfig);

          return { data: retryResponse.data };
        }
      } catch (refreshError: any) {
        // If refresh fails, logout and return error
        dispatch(logout());
        return {
          error: {
            status: refreshError.response?.status || 500,
            data: refreshError.response?.data || "Session expired. Please log in again.",
          },
        };
      }
    }

    // Other errors
    return {
      error: {
        status: error.response?.status || 500,
        data: error.response?.data || "Something went wrong",
      },
    };
  }
};

// Create API
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
