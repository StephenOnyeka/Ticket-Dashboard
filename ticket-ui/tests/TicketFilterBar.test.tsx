import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TicketFilters } from '@/components/tickets/TicketFilters';

describe('TicketFilters Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders search input and select filters', () => {
    render(<TicketFilters onFiltersChange={() => {}} />);
    expect(screen.getByPlaceholderText(/search by title, email, or keyword/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by status')).toBeInTheDocument();
    expect(screen.queryByLabelText('Filter by channel')).not.toBeInTheDocument();
  });

  it('triggers onFiltersChange when search query is typed (after debounce)', () => {
    const handleFiltersChange = vi.fn();
    render(<TicketFilters onFiltersChange={handleFiltersChange} />);
    
    const searchInput = screen.getByPlaceholderText(/search by title, email, or keyword/i);
    fireEvent.change(searchInput, { target: { value: 'checkout' } });

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(handleFiltersChange).toHaveBeenCalledWith({
      status: '',
      channel: '',
      search: 'checkout',
    });
  });

  it('triggers onFiltersChange when status filter is selected', () => {
    const handleFiltersChange = vi.fn();
    render(<TicketFilters onFiltersChange={handleFiltersChange} />);

    const statusSelect = screen.getByLabelText('Filter by status');
    fireEvent.change(statusSelect, { target: { value: 'open' } });

    expect(handleFiltersChange).toHaveBeenCalledWith({
      status: 'open',
      channel: '',
      search: '',
    });
  });
});
