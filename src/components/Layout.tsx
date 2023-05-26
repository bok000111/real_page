import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavBar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
