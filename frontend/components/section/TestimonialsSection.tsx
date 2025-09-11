import React from 'react';

const testimonials = [
  {
    name: 'Ayesha Rahman',
    feedback: 'The platform is super easy to use and I found exactly the data I needed. Highly recommended!',
    title: 'Data Analyst'
  },
  {
    name: 'Md. Imran Hossain',
    feedback: 'Selling my database was fast and secure. The escrow system gave me peace of mind.',
    title: 'leads Seller'
  },
  {
    name: 'Sadia Islam',
    feedback: 'Great support and a wide variety of databases. I will use it again!',
    title: 'Researcher'
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-blue-50 rounded-xl p-8 shadow hover:shadow-lg transition">
              <p className="text-gray-700 italic mb-4">“{t.feedback}”</p>
              <div className="font-semibold text-blue-700">{t.name}</div>
              <div className="text-sm text-gray-500">{t.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
