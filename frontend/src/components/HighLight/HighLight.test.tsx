import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HighLight } from './';

describe('Componente: HighLight', () => {
  it('deve renderizar o link, título e imagem com as props corretas', () => {
    const mockProps = {
      href: '/receita-teste',
      title: 'Bolo de Cenoura para Pets',
      src: 'caminho/para/imagem.jpg',
    };

    render(<HighLight {...mockProps} />);

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', mockProps.href);

    const titleElement = screen.getByRole('heading', {
      name: mockProps.title,
    });
    expect(titleElement).toBeInTheDocument();

    const imageElement = screen.getByAltText(
      `Imagem Receita ${mockProps.title}`
    );
    expect(imageElement).toBeInTheDocument();
    
    expect(imageElement).toHaveAttribute('src', mockProps.src);
  });
});