import DepositTable from "@/components/section/DepositTable"

import DashboardNavbar from "@/components/shared/Navbar/DashboardNavbar"

const PaymentHistoryPage = () => {
  return (
    <div className="overflow-hidden">
      <DashboardNavbar />
      <DepositTable/>
    </div>
  )
}

export default PaymentHistoryPage