// pages/Login/Login.test.tsx
import { describe } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Login } from './index';
import { useAuth } from '../../hooks/userAuth';

vi.mock('../../hooks/userAuth', async () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../components/Header', () => ({
  Header: () => <header>Mocked Header</header>,
}));

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {

  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as vi.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Página Inicial</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('deve renderizar o formulário de login corretamente', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByText(/não tem uma conta\?/i)).toBeInTheDocument();
  });

  it('deve chamar a função de login e navegar ao submeter com credenciais válidas', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    expect(screen.getByRole('button', { name: /entrando.../i })).toBeDisabled();
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('deve exibir uma mensagem de erro se o login falhar', async () => {
    const errorMessage = 'Credenciais inválidas';
    mockLogin.mockRejectedValue(new Error(errorMessage));
    
    renderComponent();

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /entrar/i })).not.toBeDisabled();
  });

  it('não deve submeter o formulário se os campos estiverem vazios', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('deve ter um link para a página de registro', () => {
    renderComponent();
    const registerLink = screen.getByRole('link', { name: /registrar/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});