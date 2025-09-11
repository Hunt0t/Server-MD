/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useGetAnnouncementsQuery } from "@/app/redux/api/announcement/announcementApi";
import Container from "@/components/shared/Container/Container";
import Loading from "@/components/shared/Loading/Loading";
import DashboardNavbar from "@/components/shared/Navbar/DashboardNavbar";
import { format } from "date-fns";

const NewsPage = () => {
  const { data, isLoading } = useGetAnnouncementsQuery({});

  if(isLoading){
    return <Loading/>
   }

  return (
    <div className="overflow-hidden">
      <DashboardNavbar />

      <Container>
      <ul className="mt-8 grid grid-cols-2 gap-6">
        {data?.data?.map((item: any) => (
          <li
            key={item._id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <span className="text-xs text-gray-500">
                {item.createdAt
                  ? format(new Date(item.createdAt), "MMMM dd, yyyy")
                  : ""}
              </span>
            </div>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
            
          </li>
        ))}
      </ul>
      </Container>
    </div>
  );
};

export default NewsPage;