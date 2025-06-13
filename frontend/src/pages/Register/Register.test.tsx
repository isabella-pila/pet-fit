import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { RegisterPage } from './';

// --- MOCKS ---
vi.mock('../../components/Header', () => ({
  Header: () => <header data-testid="header-mock" />,
}));

const registerMock = vi.fn();
vi.mock('../../contexts/AuthContext', () => ({ 
  useAuth: () => ({ register: registerMock }),
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...original,
    useNavigate: () => navigateMock,
  };
});

describe('Página: RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve exibir uma mensagem de erro se as senhas não coincidirem', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />, { wrapper: BrowserRouter });

    await user.type(screen.getByLabelText(/nome/i), 'Outro Usuário');
    await user.type(screen.getByLabelText(/e-mail/i), 'outro@teste.com');
    await user.type(screen.getByLabelText(/^senha/i), 'senha123');
    await user.type(screen.getByLabelText(/confirma senha/i), 'senhaDIFERENTE');
    await user.click(screen.getByRole('button', { name: /registrar/i }));

    const errorMessage = await screen.findByText(/as senhas não coincidem/i);
    expect(errorMessage).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('deve exibir uma mensagem de erro se a função de registro falhar', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Este e-mail já está em uso';
    registerMock.mockRejectedValueOnce(new Error(errorMessage));

    render(<RegisterPage />, { wrapper: BrowserRouter });

    await user.type(screen.getByLabelText(/nome/i), 'Novo Usuário');
    await user.type(screen.getByLabelText(/e-mail/i), 'existente@teste.com');
    await user.type(screen.getByLabelText(/^senha/i), 'senha123');
    await user.type(screen.getByLabelText(/confirma senha/i), 'senha123');
    await user.click(screen.getByRole('button', { name: /registrar/i }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
