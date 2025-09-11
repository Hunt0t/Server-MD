import OrdersTable from "@/components/section/OrdersTable"
import DashboardNavbar from "@/components/shared/Navbar/DashboardNavbar"

const SearchPage = () => {
  return (
    <div className="overflow-hidden">
        <DashboardNavbar/>
        <OrdersTable/>
    </div>
  )
}

export default SearchPage