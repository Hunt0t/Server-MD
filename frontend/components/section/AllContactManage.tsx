"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "../shared/Loading/Loading";
import { useGetAllContactsQuery } from "@/app/redux/api/contact/contactApi";


const AllContactManage = () => {
  const { data, isLoading } = useGetAllContactsQuery({});

 
  if (isLoading) return <Loading />;
  const contacts = data?.data?.data || [];
//   console.log(contacts)

  return (
    <div className="w-full">
         <h2 className="text-center my-3">All Contacts </h2>
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 text-sm md:text-base">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Message</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact: any) => (
            <tr key={contact._id} className="border-b hover:bg-gray-100 transition-colors">
              <td className="px-4 py-3">{contact.name}</td>
              <td className="px-4 py-3">{contact.email}</td>
              <td className="px-4 py-3">{contact.subject}</td>
              <td className="px-4 py-3">{contact.message}</td>
              <td className="px-4 py-3">
                

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllContactManage;