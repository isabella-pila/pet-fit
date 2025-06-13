import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './';

describe('Componente: Footer', () => {

  it('deve renderizar o texto do rodapé corretamente', () => {

    render(<Footer />);

    const footerTextElement = screen.getByText(/@petfit/i);

    expect(footerTextElement).toBeInTheDocument();
  });
});