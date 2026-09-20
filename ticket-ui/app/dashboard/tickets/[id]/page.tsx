'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { TicketDetailPanel } from '@/components/tickets/TicketDetailPanel';
import { useTicket, useTicketStream } from '@/lib/hooks/useTickets';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  // Subscribe to real-time updates for this specific ticket
  useTicketStream(true);

  const { data: ticket, isLoading, isError } = useTicket(ticketId);

  return (
    <div className="page-content">
      <Header
        title={isLoading ? 'Loading ticket…' : ticket?.title || 'Ticket Detail'}
        subtitle={ticket ? `#${ticket.id} · ${ticket.channel} channel` : ''}
        actions={
          <Button
            variant="ghost"
            onClick={() => router.back()}
            leftIcon={<span aria-hidden="true">←</span>}
          >
            Back
          </Button>
        }
      />

      <div className="page-body">
        <TicketDetailPanel
          ticket={ticket}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
}
