import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { SavedRecipes } from './';

vi.mock('../../components/Header', () => ({
  Header: () => <header>Header Mock</header>,
}));

vi.mock('../../components/HighLight', () => ({
  HighLight: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock('../../components/Button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

const mockSetUserName = vi.fn();
vi.mock('../../hooks/userAuth', () => ({
  useAuth: () => ({
    currentUser: { name: 'Usuário Padrão' },
    setUserName: mockSetUserName,
  }),
}));

vi.mock('../../mocks/savedRecipesMock', () => ({
  savedRecipesMock: [
    { id: '1', title: 'Bolo de Cenoura Fofinho', saved: true, image: 'bolo.jpg' },
    { id: '2', title: 'Frango Grelhado com Limão', saved: true, image: 'frango.jpg' },
    { id: '3', title: 'Torta de Maçã', saved: false, image: 'torta.jpg' },
  ],
}));



describe('Página: SavedRecipes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o nome do usuário e as receitas salvas corretamente', () => {
    render(<SavedRecipes />, { wrapper: BrowserRouter });

    expect(screen.getByRole('heading', { name: /receitas salvas/i })).toBeInTheDocument();

    const greeting = screen.getByText((content, element) => {
      return element.textContent === 'Olá, Usuário Padrão!';
    });
    expect(greeting).toBeInTheDocument();

    expect(screen.getByText('Bolo de Cenoura Fofinho')).toBeInTheDocument();
    expect(screen.getByText('Frango Grelhado com Limão')).toBeInTheDocument();

    expect(screen.queryByText('Torta de Maçã')).not.toBeInTheDocument();
  });

  it('deve remover uma receita da lista ao clicar em "Remover"', async () => {
    const user = userEvent.setup();
    render(<SavedRecipes />, { wrapper: BrowserRouter });

    expect(screen.getByText('Bolo de Cenoura Fofinho')).toBeInTheDocument();

    const removeButtons = screen.getAllByRole('button', { name: /remover/i });
    await user.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Bolo de Cenoura Fofinho')).not.toBeInTheDocument();
    });
  });

  it('deve permitir que o usuário edite e salve um novo nome', async () => {
    const user = userEvent.setup();
    render(<SavedRecipes />, { wrapper: BrowserRouter });

    await user.click(screen.getByRole('button', { name: /editar nome/i }));

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();


    await user.clear(input);
    await user.type(input, 'Novo Nome do Usuário');

    
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(mockSetUserName).toHaveBeenCalledWith('Novo Nome do Usuário');

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  it('deve exibir uma mensagem de estado vazio quando não houver receitas', async () => {
    const user = userEvent.setup();
    render(<SavedRecipes />, { wrapper: BrowserRouter });

 
    const removeButtons = screen.getAllByRole('button', { name: /remover/i });
    await user.click(removeButtons[0]);
    await user.click(removeButtons[1]);

    expect(await screen.findByText(/você ainda não salvou nenhuma receita/i)).toBeInTheDocument();
  });
});