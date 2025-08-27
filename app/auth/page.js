'use client';

import PublicRoute from '@/components/PublicRoute';
import AuthPage from '@/components/auth/AuthPage';

export default function AuthPageRoute() {
  return (
    <PublicRoute>
      <AuthPage />
    </PublicRoute>
  );
}