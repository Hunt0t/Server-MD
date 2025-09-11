import { tagTypes } from "@/app/types/tag-types";
import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registation: builder.mutation({
      query: (userInfo) => ({
        url: "/user/create-user",
        method: "POST",
        body: userInfo,
      }),
    }),
      changeUserStatus: builder.mutation({
        query: (userInfo) => ({
          url: `/user/${userInfo.id}/status`,
          method: "PATCH",
          body: userInfo,
        }),
      }),

    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    logoutAllUser: builder.mutation({
      query: () => ({
        url: "/auth/logout-other-user",
        method: "POST",
      }),
    }),

    forget: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
    }),
    Verified: builder.mutation({
      query: (data) => ({
        url: "/verify",
        method: "POST",
        body: data,
      }),
    }),

    verifyAccount: builder.mutation({
      query: (data) => ({
        url: "/auth/verification",
        method: "POST",
        body: data,
      }),
    }),
    verifyForgetPasswordCode: builder.mutation({
      query: (data) => ({
        url: "/auth/new-password-verification",
        method: "PUT",
        body: data,
      }),
    }),
    resendVerificationCode: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/resend-verification-code",
        method: "PUT",
        body: userInfo,
      }),
    }),

    setNewPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/set-new-password",
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: `/auth/get-me`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),

    allUserManage: builder.query({
      query: () => ({
        url: `/user/users`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),


    enable2fa: builder.query({
      query: () => ({
        url: `/auth/enable-2fa`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),

    verify2fa: builder.mutation({
      query: (data) => ({
        url: `/auth/verify-2fa`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [tagTypes.user],
    }),
    login2FA: builder.mutation({
      query: (data) => ({
        url: `/auth/login-2fa`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [tagTypes.user],
    }),

    editProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/update-me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    deleteMe: builder.mutation({
      query: () => ({
        url: `/auth/delete-me`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useRegistationMutation,
  useChangeUserStatusMutation,
  useLoginMutation,
  useLogoutUserMutation,
  useLogoutAllUserMutation,
  useGetMeQuery,
  useAllUserManageQuery,
  useVerifyAccountMutation,
  useForgetMutation,
  useSetNewPasswordMutation,
  useResendVerificationCodeMutation,
  useVerifyForgetPasswordCodeMutation,
  useEditProfileMutation,
  useChangePasswordMutation,
  useDeleteMeMutation,
  useVerifiedMutation,
  useLazyEnable2faQuery,
  useVerify2faMutation,
  useLogin2FAMutation
} = authApi;
