"use client"
import { useState } from 'react'
import ReuseInput from '../shared/Form/ReuseInput'
import ReuseMainForm from '../shared/Form/ReuseMainForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useSetNewPasswordMutation } from '@/app/redux/api/auth/authApi'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import Container from '../shared/Container/Container'

interface FormData {
  password: string;
  confirmPassword: string;
}

export const validationSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });



export const defaultValues= ({
 
  password:"",
  confirmPassword: ""
  
})

const NewPassword = () => {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const togglePasswordConfirmVisibility = () => {
    setIsPasswordConfirmVisible(!isPasswordConfirmVisible);
  };
  const router = useRouter();

  const [setNewPassword, { isLoading }] = useSetNewPasswordMutation();
 const handlenewPassword =async (data:FormData)=>{
  // console.log(data)
  const {password} = data

  try {
    const res = await setNewPassword({password}).unwrap();
    console.log(res)
    if(res?.success){
      Swal.fire({
        
        icon: "success",
        title:res?.message,
        showConfirmButton: false,
        timer: 3000
      });
      router.push("/login");
     }
  } catch (err) {
    console.log(err)
    const error = err as { data: { message: string } };
  
    Swal.fire({
      icon: "error",
      title: error?.data?.message,
    });
  }

 }

  return (
    <div>
        <Container className="h-[100vh] flex items-center justify-center">
            <div className="bg-white md:p-10 p-5 max-w-lg w-full mx-auto rounded-lg ">
                <h3 className="text-center font-bold">Set New Password</h3>
                <p className="text-center mb-5">Please enter your new password below</p>

                <ReuseMainForm onSubmit={handlenewPassword} resolver={zodResolver(validationSchema)} defaultValues={defaultValues}>
                <div className="flex flex-col gap-[10px] relative">
                  <label
                    className="text-[#666] md:text-[18px] text-[14px]  font-normal md:leading-[23.4px] leading-[18px]"
                    htmlFor="password"
                  >
                    {("Password")}
                  </label>

                  
                     <ReuseInput name="password" type={isPasswordVisible ? "text" : "password"}  
                       className={`w-full h-[45px]  rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px]  font-normal placeholder-[#999] text-textColor placeholder:font-normal`}
                    
                    />
                  <div
                    className="absolute md:top-[46px] top-[41px] right-4 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? <FiEye className="text-secondaryColor" size={24} /> : <FiEyeOff className="text-secondaryColor" size={24} />}
                  </div>
                  
                </div>

                <div className="flex flex-col gap-[10px] md:mt-[30px] mt-4 relative">
                  <label
                    className="text-[#666] md:text-[18px] text-[14px]  font-normal md:leading-[23.4px] leading-[18px]"
                    htmlFor="confirmPassword"
                  >
                   {("Confirm Password")}
                  </label>

                  <ReuseInput name="confirmPassword" type={isPasswordConfirmVisible ? "text" : "password"} 
                      className={`w-full h-[45px]  rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px]  font-normal placeholder-[#999] text-textColor placeholder:font-normal`}
                    
                    />
                  <div
                    className="absolute md:top-[46px] top-[41px] right-4 cursor-pointer"
                    onClick={togglePasswordConfirmVisibility}
                  >
                    {isPasswordConfirmVisible ? <FiEye className="text-secondaryColor" size={24} /> : <FiEyeOff className="text-secondaryColor" size={24} />}
                  </div>
                  
                </div>

              
                

                <button
                  className={`rounded-[6px] mt-[20px] w-full h-[45px] text-white text-[14px] text-center bg-btnColor font-medium leading-[18px] cursor-pointer`}
                >
                {isLoading ? "Updating..." : "Update Password"}
                </button>
               

              </ReuseMainForm>
            </div>
        </Container>
    </div>
  )
}

export default NewPassword