import Container from '@/components/shared/Container/Container';
import Navbar from '@/components/shared/Navbar/Navbar';
import React from 'react';

export default function AboutPage() {
  return (
   <div>
    <Navbar/>
     <Container className="md:pt-[180px] pt-[150px] px-4 text-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">About leads Marketplace</h1>
      <p className="text-lg text-gray-700 mb-4">
        Leads Marketplace is a secure platform for buying and selling valuable leads. Our mission is to connect data providers and seekers in a trusted environment, ensuring transparency, security, and ease of use for everyone.
      </p>
      <p className="text-md text-gray-600">
        Whether you are a business, researcher, or individual, you can discover, purchase, or monetize data with confidence. We verify sellers, protect transactions, and support a wide range of data categories to meet your needs.
      </p>
    </Container>
   </div>
  );
}
