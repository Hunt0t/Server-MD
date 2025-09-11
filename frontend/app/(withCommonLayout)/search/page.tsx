"use client"
import { useGetPaymentQuery } from "@/app/redux/api/payment/paymentApi";

interface Payment {
  amount: number;
  createdAt: string;
  currency: string;
  status: string;
  totalAmount: number;
  updatedAt: string;
  userId: string;
  _id: string;
}
import DataTable from "@/components/section/DataTable"
import Loading from "@/components/shared/Loading/Loading";
import DashboardNavbar from "@/components/shared/Navbar/DashboardNavbar"
import Link from "next/link";


const SearchPage = () => {

     const { data, isLoading:PLoading } = useGetPaymentQuery({
       page:'',
       limit:'',
       searchTerm:'',
       sort: "",
     });

   if (PLoading) return <Loading />;
  const payments: Payment[] = data?.data || [];
    // console.log(payments)
  const allAmountsZero = payments.length > 0 ? payments.every((p: Payment) => p.amount === 0) : true;

  return (
    <div>
      <DashboardNavbar />
      {allAmountsZero ? (
        <div className="w-full flex justify-center items-center min-h-screen">
          <div className="bg-blue-600 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
            <div className="border-b border-blue-500 px-8 pt-8 pb-4">
              <h2 className="text-3xl font-semibold text-center text-gray-900 mb-2">Welcome to SSN Pro</h2>
            </div>
            <div className="px-8 py-6 text-lg text-gray-900">
              Dear <span className="font-bold">mipisag754</span>, congratulations on registering! Before you start using our service, please read the rules of the resource. At the moment, the ability to search and purchase products for inactive users is limited. Account activation occurs automatically after the first deposit.
            </div>
            <div className="border-t border-blue-500 px-8 py-4 flex gap-4 justify-center">
              <Link href="/deposits" className="bg-red-500 text-white px-8 py-3 rounded-md font-semibold text-lg shadow hover:bg-red-600 transition cursor-pointer">Activation</Link>
              <Link href="/rules" className="bg-white text-gray-900 px-8 py-3 rounded-md font-semibold text-lg shadow hover:bg-gray-100 transition cursor-pointer">Rules</Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <DataTable />
        </div>
      )}
    </div>
  );
}

export default SearchPage