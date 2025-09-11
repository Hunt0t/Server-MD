import React from 'react';

const steps = [
  {
    title: 'Browse',
    description: 'Explore a wide range of leads listed by verified sellers.'
  },
  {
    title: 'Negotiate',
    description: 'Contact sellers, ask questions, and negotiate the best price.'
  },
  {
    title: 'Purchase',
    description: 'Buy securely with our escrow system and get instant access.'
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 mt-10">
          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 bg-white rounded-xl p-8 shadow hover:shadow-lg transition border-t-4 border-blue-400">
              <div className="text-4xl font-bold text-blue-500 mb-2">{idx + 1}</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-700">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
