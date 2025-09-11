import { tagTypes } from "@/app/types/tag-types";
import { baseApi } from "../baseApi";

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation({
      query: (userInfo) => ({
        url: "/user-contact/create-contact",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: [tagTypes.contact],
    }),
    // Payment Gateway APIs
    getPaymentGateways: builder.query({
      query: () => ({
        url: "/payment-gateway/gateways",
        method: "GET",
      }),
      providesTags: [tagTypes.contact],
    }),
    updatePaymentGateway: builder.mutation({
      query: (body) => ({
        url: `/payment-gateway`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.contact],
    }),
    updateTelegram: builder.mutation({
      query: (userInfo) => ({
        url: "/user/telegram",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: [tagTypes.contact],
    }),

    getAllContacts: builder.query({
      query: () => ({
        url: "/user-contact/contacts",
        method: "GET",
      }),
      providesTags: [tagTypes.contact],
    }),
    telegram: builder.query({
      query: () => ({
        url: "/user/telegram",
        method: "GET",
      }),
      providesTags: [tagTypes.contact],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetAllContactsQuery,
  useTelegramQuery,
  useUpdateTelegramMutation,
  useGetPaymentGatewaysQuery,
  useUpdatePaymentGatewayMutation,
} = contactApi;
