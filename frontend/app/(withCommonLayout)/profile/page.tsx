/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable react/no-unescaped-entities */
import {
    useDeleteMeMutation,
  useEditProfileMutation,
  useGetMeQuery,
  useLogoutAllUserMutation,
} from "@/app/redux/api/auth/authApi";
import { logout } from "@/app/redux/api/auth/authSlice";
import { useAppDispatch } from "@/app/redux/featuers/hooks";
import Authentication from "@/components/section/Authentication";
import Breadcrumb from "@/components/section/Breadcrumb";
import { UpdatePassword } from "@/components/section/UpdatePassword";
import Container from "@/components/shared/Container/Container";
import ReuseInput from "@/components/shared/Form/ReuseInput";
import ReuseMainForm from "@/components/shared/Form/ReuseMainForm";
import Loading from "@/components/shared/Loading/Loading";
import DashboardNavbar from "@/components/shared/Navbar/DashboardNavbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";
import z from "zod";

interface FormData {
  name: string;
  email: string;
}

 const RegisterValidationSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
});

const Profile = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
  const { data: userData, isLoading, refetch } = useGetMeQuery({});
  // console.log(userData)
  const [logoutAllUser, { isLoading: isLogoutAllLoading }] = useLogoutAllUserMutation();

  const defaultValues: FormData = {
    name: userData?.data?.name || "",
    email: userData?.data?.email || "",
  };

  const [editProfile, { isLoading: isEditLoading }] = useEditProfileMutation();
  const [deleteMe, { isLoading: isDeleteMe }] = useDeleteMeMutation();


  const handleProfile = async (data: FormData) => {
    //   console.log(data)

    try {
      const res = await editProfile(data).unwrap();
      if (res.success) {
        Swal.fire({
          title: "Success",
          text: "Profile updated successfully",
          icon: "success",
          timer: 3000,
        });
        refetch();
      }
      // console.log(res)
    } catch (error) {
      console.log(error);
    }
  };


  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once your account is deleted, all of its resources and data will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMe({}).unwrap();
          Swal.fire("Deleted!", "Your account has been deleted.", "success");
          dispatch(logout());
          router.push("/login");
        } catch (error: any) {
          Swal.fire("Error!", error?.data?.message || "Something went wrong.", "error");
        }
      }
    });
  };


  const handleLogoutAll = async () => {
    try {
      await logoutAllUser({}).unwrap();
      Swal.fire("Logged Out!", "You have been logged out from all devices.", "success");
      dispatch(logout());
      // Clear token from localStorage
      localStorage.removeItem('accessToken');
      router.push("/login");
    } catch (error: any) {
      Swal.fire("Error!", error?.data?.message || "Something went wrong.", "error");
      // If token expired, clear localStorage
      if (error?.data?.message?.toLowerCase().includes('token') || error?.status === 401) {
        localStorage.removeItem('accessToken');
      }
    }
  };

  // Auto logout if refresh token expires
  useEffect(() => {
    const checkRefreshToken = () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const payload = JSON.parse(atob(refreshToken.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < now) {
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessToken');
            dispatch(logout());
            router.push('/login');
          }
        } catch (e) {
          // If token is invalid, clear and logout
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('accessToken');
          dispatch(logout());
          router.push('/login');
        }
      }
    };
    // Check every minute
    const interval = setInterval(checkRefreshToken, 60000);
    checkRefreshToken();
    return () => clearInterval(interval);
  }, [dispatch, router]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <DashboardNavbar />
      <Container className="mt-5">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            //   { label: "Dashboard", href: "/dashboard" },
            { label: "Profile" },
          ]}
        />

        {/* Profile Information */}
        <div className="flex flex-col gap-5 md:gap-10 lg:flex-row lg:justify-between mt-10">
          <div className="lg:w-[30%] w-full">
            <h3 className="mb-2">Profile Information</h3>
            <p>Update your account's profile information and email address.</p>
          </div>

          {/* form here email and name */}
          <div className="lg:w-[60%] w-full shadow-md bg-white md:p-10 p-5 rounded-md border">
            <ReuseMainForm
              onSubmit={handleProfile}
              resolver={zodResolver(RegisterValidationSchema)}
              defaultValues={defaultValues}
              className="mt-5"
            >
              <div className="grid grid-cols-1 gap-5">
                <div className="flex flex-col gap-[10px] w-full">
                  <label
                    className="text-textColor lg:text-[18px] md:text-[18px] text-[14px] font-medium"
                    htmlFor="Phone or Email"
                  >
                    Your Name
                    <span className="text-[#F00C89] font-normal">*</span>
                  </label>

                  <ReuseInput
                    name="name"
                    type="text"
                    placeholder="Enter Your Name"
                    disabled
                    className={`w-full h-[45px] rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px]  font-normal placeholder-[#999] text-textColor placeholder:font-normal `}
                  />
                </div>

                <div className="flex flex-col gap-[10px] w-full">
                  <label
                    className="text-textColor lg:text-[18px] md:text-[18px] text-[14px]  font-medium"
                    htmlFor="Phone or Email"
                  >
                    Email
                    <span className="text-[#F00C89] font-normal ">*</span>
                  </label>

                  <ReuseInput
                    name="email"
                    type="text"
                    placeholder="Enter Your Email"
                     disabled
                    className={`w-full h-[45px]  rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px]  font-normal placeholder-[#999] text-textColor placeholder:font-normal`}
                  />
                </div>
              </div>

              <div className=" justify-end hidden">
                <button
                  className={`rounded-[6px] mt-[24px] px-6 h-[45px] text-white text-[14px] text-center bg-primary font-bold leading-[18px] cursor-pointer`}
                >
                  {isEditLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </ReuseMainForm>
          </div>
        </div>

        {/* update password */}
        <UpdatePassword />


          {/* two factor authentication */}
        <Authentication />  



          {/* logout all device */}
          <div className="flex flex-col gap-5 md:gap-10 lg:flex-row lg:justify-between mt-10">
          <div className="lg:w-[30%] w-full">
            <h3 className="mb-2">Browser Sessions </h3>
            <p>Manage and log out your active sessions on other browsers and devices.</p>
          </div>

          {/* delete */}
          <div className="lg:w-[60%] w-full shadow-md bg-white md:p-10 p-5 rounded-md border">
              <p>If necessary, you may log out of all of your other browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive. If you feel your account has been compromised, you should also update your password.</p>
         
              <div className="mt-5">
                <button
                 onClick={handleLogoutAll}
                  className={`rounded-[6px] mt-[24px] px-6 h-[45px] text-white text-[14px] text-center bg-primary font-bold leading-[18px] cursor-pointer uppercase`}
                >
                  {isLogoutAllLoading ? "Logouting..." : "Logout other browser sessions"}
                </button>
              </div>
         
          </div>
        </div>


         {/* Delete account */}
         <div className="flex flex-col gap-5 md:gap-10 lg:flex-row lg:justify-between mt-10">
          <div className="lg:w-[30%] w-full">
            <h3 className="mb-2">Delete Account  </h3>
            <p>Permanently delete your account.</p>
          </div>

          {/* delete */}
          <div className="lg:w-[60%] w-full shadow-md bg-white md:p-10 p-5 rounded-md border">
              <p>Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.</p>
         
              <div className="mt-5">
                <button
                 onClick={handleDelete}
                  className={`rounded-[6px] mt-[24px] w-[180px] h-[45px] text-white text-[14px] text-center bg-btnColor font-bold leading-[18px] cursor-pointer`}
                >
                  {isDeleteMe ? "Deleting..." : "DELETE ACCOUNT"}
                </button>
              </div>
         
          </div>
        </div>

          
      </Container>
    </div>
  );
};

export default Profile;
