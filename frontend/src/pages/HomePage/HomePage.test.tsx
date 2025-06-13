import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from './';

vi.mock('../../hooks/userAuth', () => ({
  useAuth: () => ({
    currentUser: null, 
    logout: vi.fn(),
  }),
}));

const mockRecipes = [
  {
    id: 1,
    title: 'Muffin salgado para cães',
    category: 'cachorro',
    src: 'muffin-caes.jpg',
    href: 'receita1.html',
  },
  {
    id: 2,
    title: 'Biscoitinho saudável de atum',
    category: 'gato',
    src: 'biscoito-gato.jpg',
    href: 'receita2.html',
  },
];

vi.mock('../../data/recipesMock', () => ({
  recipes: mockRecipes,
}));

vi.mock('../../components/HighLight', () => ({
  HighLight: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock('../../components/HighlightVideo', () => ({
  HighlightVideo: () => <div>Vídeo em Destaque</div>,
}));

describe('Página: HomePage', () => {

  it('deve filtrar o conteúdo do componente Emphasis quando o usuário digita no Header', async () => {
    render(<HomePage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    expect(screen.getByText('Muffin salgado para cães')).toBeInTheDocument();
    expect(screen.getByText('Biscoitinho saudável de atum')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/busca/i);
    await user.type(searchInput, 'cães');

    expect(screen.getByText('Muffin salgado para cães')).toBeInTheDocument();
    
    expect(screen.queryByText('Biscoitinho saudável de atum')).toBeNull();
  });
});