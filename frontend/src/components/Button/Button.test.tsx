

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './';

describe('Componente: Button', () => {

  it('deve renderizar com o texto correto', () => {
    
    render(<Button>Clique Aqui</Button>);

    
    const buttonElement = screen.getByRole('button', { name: /clique aqui/i });
    expect(buttonElement).toBeInTheDocument();
  });

  
  it('deve chamar a função onClick quando for clicado', async () => {
    
    const onClickMock = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={onClickMock}>Enviar</Button>);
    const buttonElement = screen.getByRole('button', { name: /enviar/i });

    await user.click(buttonElement);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('deve estar desabilitado quando a prop "disabled" for passada', () => {
  
    render(<Button disabled>Desabilitado</Button>);
    const buttonElement = screen.getByRole('button', { name: /desabilitado/i });

    expect(buttonElement).toBeDisabled();
  });

  it('não deve chamar a função onClick se estiver desabilitado', async () => {
    const onClickMock = vi.fn();
    const user = userEvent.setup();
    render(
      <Button onClick={onClickMock} disabled>
        Não Clicável
      </Button>
    );
    const buttonElement = screen.getByRole('button', { name: /não clicável/i });

    await user.click(buttonElement);

    expect(onClickMock).not.toHaveBeenCalled();
  });
});