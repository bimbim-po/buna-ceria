import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { HomeContent } from '@/components/HomeContent';

export default function BelajarWebAppPage() {
  return (
    <AppProvider initialMode="webapp">
      <HomeContent initialMode="webapp" />
    </AppProvider>
  );
}
