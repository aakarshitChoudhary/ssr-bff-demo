'use client';

import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/auth.service';

export function useLogin() {
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      login(username, password),
  });
}