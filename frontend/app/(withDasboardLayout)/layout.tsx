import DashBoardMenu from "@/components/dashboard-section/DashBoardMenu";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>
    <DashBoardMenu/>
    {children}
  </div>;
};

export default DashboardLayout;
