'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { TicketFilters } from '@/components/tickets/TicketFilters';
import { TicketTable } from '@/components/tickets/TicketTable';
import { TicketStatsCardsDetailed } from '@/components/tickets/TicketStatsCards';
import { NewTicketModal } from '@/components/tickets/NewTicketModal';
import { useTickets, useTicketStream } from '@/lib/hooks/useTickets';
import { Add } from 'iconsax-react';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    channel: searchParams.get('channel') || '',
    search: '',
  });

  // Subscribe to real-time SSE updates
  useTicketStream(true);

  // Sync URL params → filters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      status: searchParams.get('status') || '',
      channel: searchParams.get('channel') || '',
    }));
    setPage(1);
  }, [searchParams]);

  // Data queries
  const { data, isLoading, isError } = useTickets({
    status: filters.status,
    channel: filters.channel,
    search: filters.search,
    page,
    limit: 10,
  });

  // Counts for stat cards
  const { data: openData } = useTickets({ status: 'open', limit: 1 });
  const { data: pendingData } = useTickets({ status: 'pending', limit: 1 });
  const { data: closedData } = useTickets({ status: 'closed', limit: 1 });
  const { data: allData } = useTickets({ limit: 1 });

  const handleFiltersChange = useCallback(
    (newFilters: { status: string; channel: string; search: string }) => {
      setFilters(newFilters);
      setPage(1);
    },
    [],
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header
        title="Ticket Dashboard"
        subtitle="Monitor and resolve customer support tickets"
        showSSEIndicator={true}
        actions={
          <Button
            id="new-ticket-btn"
            variant="primary"
            onClick={() => setIsNewTicketOpen(true)}
            leftIcon={<Add size={18} variant="Linear" color="currentColor" />}
          >
            New Ticket
          </Button>
        }
      />

      <div className="p-6 max-w-7xl mx-auto w-full flex-1 space-y-6">
        {/* Stats */}
        <TicketStatsCardsDetailed
          totalAll={allData?.total ?? 0}
          totalOpen={openData?.total ?? 0}
          totalPending={pendingData?.total ?? 0}
          totalClosed={closedData?.total ?? 0}
          isLoading={isLoading}
        />

        {/* Filters */}
        <TicketFilters
          onFiltersChange={handleFiltersChange}
          initialStatus={filters.status}
          initialChannel={filters.channel}
        />

        {/* Table */}
        <TicketTable
          data={data}
          isLoading={isLoading}
          isError={isError}
          page={page}
          onPageChange={setPage}
        />
      </div>

      {/* New Ticket Modal */}
      <NewTicketModal isOpen={isNewTicketOpen} onClose={() => setIsNewTicketOpen(false)} />
    </div>
  );
}
