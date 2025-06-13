import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RecipePage from './';

vi.mock('../../mocks/recipes', () => ({
  recipes: [
    {
      id: '1',
      title: 'Bolo de Cenoura para Pets',
      ingredients: ['1 cenoura'],
      instructions: ['Misture tudo.'],
    },
  ],
}));

vi.mock('../../components/Header', () => ({ Header: () => <header /> }));
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../../hooks/userAuth', () => ({
  
  useAuth: () => ({
    
    currentUser: null,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));


describe('Página: RecipePage (Teste de Diagnóstico)', () => {

  it('deve renderizar o título da receita quando um ID válido é fornecido', () => {
    
    render(
      <MemoryRouter initialEntries={['/recipe/1']}>
        <Routes>
          <Route path="/recipe/:recipeId" element={<RecipePage />} />
        </Routes>
      </MemoryRouter>
    );

    
    const headingElement = screen.getByRole('heading', {
      name: /bolo de cenoura para pets/i,
    });
    
    expect(headingElement).toBeInTheDocument();
  });
});