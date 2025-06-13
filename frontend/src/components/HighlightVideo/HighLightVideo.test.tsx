import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HighlightVideo } from './';

describe('Componente: HighlightVideo', () => {

  it('deve renderizar o título e o vídeo corretamente', () => {
    render(<HighlightVideo />);

    const titleElement = screen.getByRole('heading', {
      name: /receitas saudáveis para o seu pet/i,
    });
    expect(titleElement).toBeInTheDocument();

    const iframeElement = screen.getByTitle('YouTube video player');
    expect(iframeElement).toBeInTheDocument();

    expect(iframeElement).toHaveAttribute(
      'src',
      'https://www.youtube.com/embed/v7YnV7Wr7pQ?si=ywH90S46gLGJ9zLa'
    );
  });
});