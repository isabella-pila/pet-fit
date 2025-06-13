import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Emphasis } from './';

const mockRecipes = [
  {
    id: 1,
    title: 'Muffin salgado para cães',
    category: 'cachorro',
    src: './src/assets/receita1.png',
    href: 'receita1.html',
  },
  {
    id: 2,
    title: 'Biscoitinho saudável de atum',
    category: 'gato',
    src: './src/assets/receita2.png',
    href: 'receita2.html',
  },
  {
    id: 3,
    title: 'Pizza para cães',
    category: 'cachorro',
    src: './src/assets/receita3.png',
    href: 'receita3.html',
  },
  {
    id: 4,
    title: 'Muffin salgado para gatos',
    category: 'gato',
    src: './src/assets/receita4.png',
    href: 'receita4.html',
  },
];

vi.mock('../../data/recipesMock', () => ({
  recipes: mockRecipes,
}));

vi.mock('../HighLight', () => ({
  HighLight: ({ title, href }: { title: string; href: string }) => (
    <a href={href}>{title}</a>
  ),
}));

vi.mock('../HighlightVideo', () => ({
  HighlightVideo: () => <div data-testid="highlight-video-mock" />,
}));

describe('Componente: Emphasis', () => {

  it('deve renderizar todos os destaques quando o termo de busca está vazio', () => {
    render(<Emphasis searchTerm="" />);

    expect(screen.getByText('Muffin salgado para cães')).toBeInTheDocument();
    expect(screen.getByText('Biscoitinho saudável de atum')).toBeInTheDocument();
    expect(screen.getByText('Pizza para cães')).toBeInTheDocument();
    expect(screen.getByText('Muffin salgado para gatos')).toBeInTheDocument();
    
    expect(screen.queryByText('Nenhuma receita encontrada.')).toBeNull();
  });

  it('deve filtrar e renderizar apenas as receitas correspondentes ao termo de busca (pelo título)', () => {
    
    render(<Emphasis searchTerm="muffin" />);

    expect(screen.getByText('Muffin salgado para cães')).toBeInTheDocument();
    expect(screen.getByText('Muffin salgado para gatos')).toBeInTheDocument();
    
    expect(screen.queryByText('Biscoitinho saudável de atum')).toBeNull();
    expect(screen.queryByText('Pizza para cães')).toBeNull();
  });

  it('deve filtrar e renderizar apenas as receitas correspondentes ao termo de busca (pela categoria)', () => {
    render(<Emphasis searchTerm="gato" />);

    expect(screen.getByText('Biscoitinho saudável de atum')).toBeInTheDocument();
    expect(screen.getByText('Muffin salgado para gatos')).toBeInTheDocument();
    
    expect(screen.queryByText('Muffin salgado para cães')).toBeNull();
    expect(screen.queryByText('Pizza para cães')).toBeNull();
  });

  it('deve exibir a mensagem "Nenhuma receita encontrada" se o filtro não encontrar resultados', () => {
    render(<Emphasis searchTerm="receita-inexistente-123" />);

    expect(screen.getByText('Nenhuma receita encontrada.')).toBeInTheDocument();
    expect(screen.queryByText('Muffin salgado para cães')).toBeNull();
  });

  it('deve sempre renderizar o título principal e o vídeo em destaque', () => {
    render(<Emphasis searchTerm="" />);

    expect(screen.getByRole('heading', { name: /destaques/i })).toBeInTheDocument();
    expect(screen.getByTestId('highlight-video-mock')).toBeInTheDocument();
  });
});