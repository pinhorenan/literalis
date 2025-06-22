// src/services/auth.service.ts
import type { SignUpDTO, SignInDTO } from '@models/auth.dto';
import { signIn } from 'next-auth/react';

export const AuthService = {
    async signUp(data: SignUpDTO) {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Erro ao cadastrar usuário');
        }

        return res.json();
    },

    async signIn(data: SignInDTO) {
        const res = await signIn('credentials', {
            redirect: false,
            ...data,
        });

        if (!res || res.ok === false) {
            throw new Error(res?.error || 'Usuário ou senha inválidos');
        }

        return res;
    },
};