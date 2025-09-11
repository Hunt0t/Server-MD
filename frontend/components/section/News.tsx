import { format } from "date-fns";

interface NewsItem {
  title: string;
  description: string;
  date: string | Date;
}

const newsData: NewsItem[] = [
  {
    title: "New Feature Released!",
    description: "We have launched a new feature to improve your experience.",
    date: new Date(),
  },
  {
    title: "Scheduled Maintenance",
    description: "Our service will be down for maintenance on August 25, 2025.",
    date: "2025-08-25T10:00:00Z",
  },
];

const News = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Announcements</h1>
      <ul className="space-y-6">
        {newsData.map((item, idx) => (
          <li key={idx} className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <span className="text-xs text-gray-500">
                {format(new Date(item.date), "MMMM dd, yyyy")}
              </span>
            </div>
            <p className="text-gray-700">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;
