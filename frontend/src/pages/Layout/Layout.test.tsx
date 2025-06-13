
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './index';


vi.mock('../../components/Footer', () => ({
  Footer: () => {
    return <footer data-testid="footer">Rodapé Mockado</footer>;
  },
}));

vi.mock('./styles', () => ({
  SMain: ({ children }: { children: React.ReactNode }) => {
    return <main>{children}</main>;
  },
}));

describe('Layout Component', () => {
  it('deve renderizar o Footer e o conteúdo da rota filha (Outlet)', () => {
    
    const PaginaFilhaDeTeste = () => <div>Conteúdo da Página Filha</div>;

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PaginaFilhaDeTeste />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Conteúdo da Página Filha')).toBeInTheDocument();

    
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Rodapé Mockado')).toBeInTheDocument();
  });

  it('deve renderizar apenas o layout (com footer) se não houver rota filha correspondente', () => {
    
    const PaginaFilhaDeTeste = () => <div>Página Filha Específica</div>;

    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/app" element={<Layout />}>
            <Route path="child-route" element={<PaginaFilhaDeTeste />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    
    expect(screen.queryByText('Página Filha Específica')).not.toBeInTheDocument();

    
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});