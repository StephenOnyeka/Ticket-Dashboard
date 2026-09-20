'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { useCreateTicket } from '@/lib/hooks/useTickets';
import { useToast } from '@/components/ui/Toast';
import type { TicketChannel } from '@/lib/types';

// ─────────────────────────────────────────────
//  New Ticket Modal
// ─────────────────────────────────────────────

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHANNEL_OPTIONS = [
  { value: 'web', label: '🌐 Web' },
  { value: 'email', label: '✉️ Email' },
  { value: 'messaging', label: '💬 Messaging' },
];

interface FormData {
  title: string;
  body: string;
  channel: TicketChannel;
  userEmail: string;
  userName: string;
}

interface FormErrors {
  title?: string;
  body?: string;
  userEmail?: string;
}

export function NewTicketModal({ isOpen, onClose }: NewTicketModalProps) {
  const { showToast } = useToast();
  const createTicket = useCreateTicket();
  const [form, setForm] = useState<FormData>({
    title: '',
    body: '',
    channel: 'web',
    userEmail: '',
    userName: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.body.trim()) newErrors.body = 'Description is required';
    if (!form.userEmail.trim()) newErrors.userEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.userEmail))
      newErrors.userEmail = 'Enter a valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createTicket.mutateAsync({
        title: form.title.trim(),
        body: form.body.trim(),
        channel: form.channel,
        userEmail: form.userEmail.trim().toLowerCase(),
        userName: form.userName.trim() || form.userEmail.trim(),
      });
      showToast('success', 'Ticket created successfully!');
      setForm({ title: '', body: '', channel: 'web', userEmail: '', userName: '' });
      setErrors({});
      onClose();
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to create ticket');
    }
  }

  function handleClose() {
    setForm({ title: '', body: '', channel: 'web', userEmail: '', userName: '' });
    setErrors({});
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Ticket"
      size="md"
      footer={
        <div className="modal-footer-actions">
          <Button variant="ghost" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={createTicket.isPending}
            type="submit"
          >
            Create Ticket
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="new-ticket-form" noValidate>
        <Input
          id="new-ticket-title"
          label="Title *"
          placeholder="Brief description of the issue"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          required
        />

        <Textarea
          id="new-ticket-body"
          label="Description *"
          placeholder="Describe the issue in detail…"
          value={form.body}
          onChange={(e) => handleChange('body', e.target.value)}
          error={errors.body}
          rows={4}
          required
        />

        <div className="form-row">
          <Input
            id="new-ticket-email"
            label="Customer Email *"
            type="email"
            placeholder="customer@example.com"
            value={form.userEmail}
            onChange={(e) => handleChange('userEmail', e.target.value)}
            error={errors.userEmail}
            required
          />
          <Input
            id="new-ticket-name"
            label="Customer Name"
            placeholder="Full name (optional)"
            value={form.userName}
            onChange={(e) => handleChange('userName', e.target.value)}
          />
        </div>

        <Select
          id="new-ticket-channel"
          label="Channel"
          value={form.channel}
          onChange={(e) => handleChange('channel', e.target.value as TicketChannel)}
          options={CHANNEL_OPTIONS}
        />
      </form>
    </Modal>
  );
}
