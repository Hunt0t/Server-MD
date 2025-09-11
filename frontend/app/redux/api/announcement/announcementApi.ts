
import { tagTypes } from "@/app/types/tag-types";
import { baseApi } from "../baseApi";

const announcementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAnnouncement: builder.mutation({
      query: (announcement) => ({
        url: "/announcement/create-announcement",
        method: "POST",
        body: announcement,
      }),
      invalidatesTags: [tagTypes.announcement],
    }),

    getAnnouncements: builder.query({
      query: () => ({
        url: "/announcement/announcements",
        method: "GET",
      }),
      providesTags: [tagTypes.announcement],
    }),

    editAnnouncement: builder.mutation({
      query: ({ id, data }) => ({
        url: `/announcement/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.announcement],
    }),

    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/announcement/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.announcement],
    }),
  }),
});

export const {
  useCreateAnnouncementMutation,
  useGetAnnouncementsQuery,
  useEditAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementApi;
