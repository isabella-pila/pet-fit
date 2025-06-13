import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotFoundPage } from './';

describe('Página: NotFoundPage', () => {

  it('deve renderizar o conteúdo da página 404 e o link para a home', () => {

    render(<NotFoundPage />, { wrapper: BrowserRouter });

    const heading = screen.getByRole('heading', {
      name: /404 - página não encontrada/i,
    });
    expect(heading).toBeInTheDocument();

    const paragraph = screen.getByText(
      'A página que você está procurando não existe.'
    );
    expect(paragraph).toBeInTheDocument();

    const link = screen.getByRole('link', {
      name: /voltar para a página inicial/i,
    });
    expect(link).toBeInTheDocument();

    expect(link).toHaveAttribute('href', '/');
  });
});