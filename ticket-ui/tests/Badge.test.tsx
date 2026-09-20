import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, StatusBadge, ChannelBadge } from '@/components/ui/Badge';

// ─────────────────────────────────────────────
//  Generic Badge Component
// ─────────────────────────────────────────────

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge variant="open">OPEN</Badge>);
    expect(screen.getByText('OPEN')).toBeInTheDocument();
  });

  it('renders as an inline-flex span element', () => {
    const { container } = render(<Badge variant="open">OPEN</Badge>);
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('inline-flex');
    expect(el).toHaveClass('items-center');
    expect(el).toHaveClass('rounded-lg');
  });

  it('applies extra className passed via prop', () => {
    const { container } = render(
      <Badge variant="open" className="custom-test-class">
        OPEN
      </Badge>,
    );
    expect(container.firstChild).toHaveClass('custom-test-class');
  });

  it('renders sm size with smaller padding', () => {
    const { container } = render(
      <Badge variant="open" size="sm">
        OPEN
      </Badge>,
    );
    expect(container.firstChild).toHaveClass('px-2');
    expect(container.firstChild).toHaveClass('py-0.5');
  });

  it('renders md size (default) with standard padding', () => {
    const { container } = render(<Badge variant="high">HIGH</Badge>);
    expect(container.firstChild).toHaveClass('px-2.5');
    expect(container.firstChild).toHaveClass('py-1');
  });
});

// ─────────────────────────────────────────────
//  StatusBadge Component
// ─────────────────────────────────────────────

describe('StatusBadge Component', () => {
  it('renders "Open" label for open status', () => {
    render(<StatusBadge status="open" />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('renders "Pending" label for pending status', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders "Closed" label for closed status', () => {
    render(<StatusBadge status="closed" />);
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('applies emerald color for open status', () => {
    const { container } = render(<StatusBadge status="open" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('emerald');
  });

  it('applies amber color for pending status', () => {
    const { container } = render(<StatusBadge status="pending" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('amber');
  });

  it('applies slate color for closed status', () => {
    const { container } = render(<StatusBadge status="closed" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('slate');
  });
});

// ─────────────────────────────────────────────
//  ChannelBadge Component
// ─────────────────────────────────────────────

describe('ChannelBadge Component', () => {
  it('renders "Web" label for web channel', () => {
    render(<ChannelBadge channel="web" />);
    expect(screen.getByText('Web')).toBeInTheDocument();
  });

  it('renders "Email" label for email channel', () => {
    render(<ChannelBadge channel="email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders "Messaging" label for messaging channel', () => {
    render(<ChannelBadge channel="messaging" />);
    expect(screen.getByText('Messaging')).toBeInTheDocument();
  });

  it('applies blue color for web channel', () => {
    const { container } = render(<ChannelBadge channel="web" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('blue');
  });

  it('applies purple color for email channel', () => {
    const { container } = render(<ChannelBadge channel="email" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('purple');
  });

  it('applies teal color for messaging channel', () => {
    const { container } = render(<ChannelBadge channel="messaging" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('teal');
  });
});
