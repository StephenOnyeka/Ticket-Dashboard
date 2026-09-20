import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge variant="open">OPEN</Badge>);
    expect(screen.getByText('OPEN')).toBeInTheDocument();
  });

  it('applies open badge styling variant', () => {
    const { container } = render(<Badge variant="open">OPEN</Badge>);
    expect(container.firstChild).toHaveClass('badge-open');
  });

  it('applies high priority styling variant', () => {
    const { container } = render(<Badge variant="high">HIGH</Badge>);
    expect(container.firstChild).toHaveClass('badge-high');
  });
});
