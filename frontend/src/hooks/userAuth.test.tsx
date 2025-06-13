import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React, { type ReactNode } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextType } from '../contexts/AuthContext';
import { useAuth } from './userAuth';

describe('Hook: useAuth (Teste Isolado)', () => {
  it('deve lançar um erro se for usado fora de um AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth deve ser usado com AuthProvider'
    );

    spy.mockRestore(); 
  });

  it('deve retornar o valor do contexto quando usado dentro de um Provider', () => {
    
    const mockContextValue: AuthContextType = {
      currentUser: { id: 'mock-id', name: 'Usuário Mock', email: 'mock@email.com', role: 'user' },
      isLoading: false,
      login: async () => {},
      register: async () => {},
      logout: () => {},
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.currentUser?.name).toBe('Usuário Mock');
    expect(result.current.logout).toBe(mockContextValue.logout);
  });
});