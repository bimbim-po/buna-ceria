import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { HomeContent } from '@/components/HomeContent';

export default function HomePage() {
  return (
    <AppProvider initialMode="landing">
      <HomeContent initialMode="landing" />
    </AppProvider>
  );
}
