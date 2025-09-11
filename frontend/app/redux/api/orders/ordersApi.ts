import { tagTypes } from "@/app/types/tag-types";
import { baseApi } from "../baseApi";

const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrders: builder.mutation({
      query: (userInfo) => ({
        url: "/orders/create",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: [tagTypes.order],
    }),
    exportOrders: builder.query({
      query: (ids?: string[] | string) => {
        return {
          url : `/product/export?ids=${ids}`,
          method: "GET",
        };
      },
      // No cache tags needed for export
    }),
    getOrders: builder.query({
      query: ({
        page = 1,
        searchTerm,
        limit = 10,
        sort,
      }) => {
        // console.log("orderIdMode:", sort);
        return {
          url: `/orders/orders?page=${page}&limit=${limit}&searchTerm=${searchTerm}&sort=${
            sort || "no"
          }`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.order],
    }),

   

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.order],
    }),

   
  }),
});

export const {
  useCreateOrdersMutation,
  useGetOrdersQuery,
  useDeleteOrderMutation,
  useLazyExportOrdersQuery,
} = ordersApi;
