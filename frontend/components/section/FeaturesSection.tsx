import React from 'react';

const features = [
  {
    title: 'Secure Transactions',
    description: 'All leads deals are protected with industry-leading security and escrow services.'
  },
  {
    title: 'Verified Sellers',
    description: 'We verify sellers to ensure authenticity and trust for buyers.'
  },
  {
    title: 'Diverse Categories',
    description: 'Find leads from various industries and interests, all in one place.'
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-blue-50 rounded-xl p-8 shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
