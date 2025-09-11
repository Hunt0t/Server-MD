import { tagTypes } from "@/app/types/tag-types";
import { baseApi } from "../baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (userInfo) => ({
        url: "/product/create-product",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    deleteProductsByFileName: builder.mutation({
      query: (fileName: string) => ({
        url: `/product/delete-by-file/${fileName}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.product],
    }),

    getProducts: builder.query({
      query: ({
        page = 1,
        searchTerm,
        limit = 10,
        startYear,
        endYear,
        sort,
        state,
        fileName,
      }) => {
        return {
          url: `/product/products?page=${page}&limit=${limit}&fileName=${fileName}&searchTerm=${searchTerm}&startYear=${startYear}&endYear=${endYear}&sort=${
            sort || "no"
          }${state ? `&state=${state}` : ""}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.product],
    }),

    editProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.product],
    }),

    deleteProductsByFile: builder.mutation({
      query: (fileName: string) => ({
        url: `/product/delete-by-file/${fileName}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.product],
    }),

    importOrdersJson: builder.mutation({
      query: ({ file, price }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("price", price);
        return {
          url: "/product/import-json",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [tagTypes.product],
    }),

    importOrdersCsv: builder.mutation({
      query: ({ file, price }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("price", price);
        return {
          url: "/product/import-csv",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [tagTypes.product],
    }),

    getStates: builder.query({
      query: () => {
        return {
          url: `/product/unique-states`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.product],
    }),

    getFile: builder.query({
      query: () => {
        return {
          url: `/product/unique-file-name`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.product],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useEditProductMutation,
  useDeleteProductMutation,
  useGetStatesQuery,
  useGetFileQuery,
  useImportOrdersJsonMutation,
  useImportOrdersCsvMutation,
  useDeleteProductsByFileNameMutation,
} = productApi;
