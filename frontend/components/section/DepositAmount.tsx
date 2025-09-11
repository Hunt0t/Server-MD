/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Swal from "sweetalert2"
import { useCreatePaymentMutation } from "@/app/redux/api/payment/paymentApi"

const depositSchema = z.object({
  amount: z
    .number({ error: "Amount must be a valid number" })
    .refine((val) => typeof val === "number" && !isNaN(val), {
      message: "Amount must be a valid number",
    })
    
})

  type DepositForm = z.infer<typeof depositSchema>

const DepositAmount = () => {
  const [createPayment, { isLoading }] = useCreatePaymentMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DepositForm>({
    resolver: zodResolver(depositSchema),
  })

  const onSubmit = async (data: DepositForm) => {
    try {
     const res =  await createPayment({
        amount: data.amount,
        currency: "usd",
      }).unwrap()

      // console.log("Payment Response:", res.data.nowpayments_payment_url)

      if(res){
        window.location.href = `/deposits/payment-instructions/${res.data.nowpayments_payment_url}` 
      }

      // Swal.fire({
      //   icon: "success",
      //   title: "Payment Successful",
      //   text: `You deposited $${data.amount} successfully!`,
      //   showConfirmButton: false,
      //   timer: 1000,
      // })

      reset()
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error?.data?.message || "Something went wrong. Please try again.",
        
      })
    }
  }

  return (
    <div className="flex justify-center items-center mt-5">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 border-b px-6 py-3">
          <h2 className="text-xl font-semibold text-gray-700 text-center">
            Deposit
          </h2>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 text-center">
          <p className="text-gray-600">
            First Time Minimum deposit{" "}
            <span className="font-bold text-blue-600">$50</span> for activation.
          </p>
          <p className="text-gray-500 mt-2">
            This will be added to your account instantly.
          </p>
          <p className="mt-4 font-medium text-green-600">
            Next time you can deposit minimum $15(USDT).
          </p>
          <p className="mt-4 font-medium ">
            BTC minimum deposit $60.
          </p>

          {/* Input + Button */}
          <div className="mt-6 flex">
            <input
              type="number"
              min={1}
              step="any"
              placeholder="Enter Amount"
              {...register("amount", { valueAsNumber: true })}
              className="flex-1 rounded-l-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white px-6 rounded-r-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Payment"}
            </button>
          </div>

          {/* Validation Error */}
          {errors.amount && (
            <p className="text-red-500 text-sm mt-2">{errors.amount.message}</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default DepositAmount

