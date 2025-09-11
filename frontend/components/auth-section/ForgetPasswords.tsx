/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import ReuseMainForm from "../shared/Form/ReuseMainForm"
import ReuseInput from "../shared/Form/ReuseInput"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgetMutation } from "@/app/redux/api/auth/authApi";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Container from "../shared/Container/Container";


interface FormData {
    email: string;
  }
  export const ForgetValidationSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
  })

  export const defaultValues: FormData = {
    email: "",
  };

  type ValidationError = {
    path: string;
    message: string;
  };

const ForgetPasswords = () => {
  const [error, setError] = useState<ValidationError[]>([]);
     const [forget, {isLoading}]= useForgetMutation()
     const router = useRouter()

      const handleSignin = async (data: FormData) => {
         console.log(data)
        try {
            const res = await forget({email: data?.email}).unwrap();
            console.log(res)
             if(res?.success){
              localStorage.setItem("email", data.email);
                Swal.fire({
                    icon: "success",
                    title: res.message,
                    showConfirmButton: false,
                    timer: 1000,
                });
                router.push("/new-password");
            }
        } catch (err) {
            console.log(err)
            setError((err as any)?.data?.errorSources);
        }
      };
   
      const emailError = error?.find((error) => error?.path === "not_found");


  return (
    <Container className="h-[100vh] flex justify-center items-center">
        
        <div className="bg-[#F7F9FC] md:p-10 p-5 max-w-lg w-full mx-auto rounded-lg">
           <h3 className="text-center font-bold">Forgot your password           </h3>
           <p className="text-center font-medium">We will send a 5 digit code to your email
           </p>
        <ReuseMainForm
                onSubmit={handleSignin}
                resolver={zodResolver(ForgetValidationSchema)}
                defaultValues={defaultValues}
                className="mt-5"
              >
                <div className="grid grid-cols-1 gap-3">
                 
                  <div className="flex flex-col gap-[10px] w-full">
                    <label
                      className="text-textColor lg:text-[18px] md:text-[18px] text-[14px]  font-medium"
                      htmlFor="Phone or Email"
                    >
                     
                      Enter Your Email
                      <span className="text-[#F00C89] font-normal ">
                        *
                      </span>
                    </label>

                    <ReuseInput
                      name="email"
                      type="text"
                      placeholder="Enter Your Email"
                      className={`w-full h-[45px]  rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px]  font-normal placeholder-[#999] text-textColor placeholder:font-normal ${
                        emailError ? "border-red-400" : ""
                      }`}
                    />

                    {emailError && (
                      <p className="text-red-400 text-sm font-medium">
                        {emailError?.message}
                      </p>
                    )}
                  </div>

                 

                 
                </div>

                <button
                  className={`rounded-[6px] mt-[20px] w-full h-[45px] text-white text-[14px] text-center bg-btnColor font-medium leading-[18px] cursor-pointer`}
                  disabled={isLoading}
                >
                
                 {isLoading ? "Sending Code..." : "Send Code"}
                </button>

              </ReuseMainForm>
        </div>
       
          
    </Container>
  )
}

export default ForgetPasswords