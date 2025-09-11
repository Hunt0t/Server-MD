
import { tagTypes } from "@/app/types/tag-types";
import { baseApi } from "../baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (userInfo) => ({
        url: "/payment/create",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: [tagTypes.payment],
    }),
    createPaymentByAdmin: builder.mutation({
      query: (userInfo) => ({
        url: "/payment/payment-by-admin",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: [tagTypes.payment],
    }),

    getPayment: builder.query({
      query: ({ page = 1, limit = 10, sort }) => {
        console.log("orderIdMode:", sort);
        return {
          url: `/payment/history?sort=${sort}&page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.payment],
    }),
    singlePayment: builder.query({
      query: (query) => {
        // console.log("orderIdMode:", sort);
        return {
          url: `/payment/payment-by-url?url=${query?.nowpayments_payment_url}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.payment],
    }),
    paymentProgress: builder.mutation({
      query: (query) => {
        return {
          url: `/payment/progress?url=${query?.url}`,
          method: "POST",
        };
      },
      invalidatesTags: [tagTypes.payment],
    }),
    paymentConfirm: builder.mutation({
      query: (query) => {
        return {
          url: `/payment/confirm?url=${query?.url}`,
          method: "POST",
        };
      },
      invalidatesTags: [tagTypes.payment],
    }),
    adminChangePaymentStatus: builder.mutation({
      query: ({ paymentId, status }) => ({
        url: "/payment/admin-status-change",
        method: "POST",
        body: { paymentId, status },
      }),
      invalidatesTags: [tagTypes.payment],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetPaymentQuery,
  useSinglePaymentQuery,
  usePaymentProgressMutation,
  usePaymentConfirmMutation,
  useCreatePaymentByAdminMutation,
  useAdminChangePaymentStatusMutation
} = paymentApi;
