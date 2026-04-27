import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onRequestPost } from './waitlist';

// ── Helpers ───────────────────────────────────────────────────────────────────

interface Env {
  RESEND_API_KEY?: string;
  RESEND_AUDIENCE_ID?: string;
}

function makeCtx(body: unknown, env: Env = { RESEND_API_KEY: 'test-key', RESEND_AUDIENCE_ID: 'aud-123' }) {
  const request = new Request('https://cinchcli.com/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  // Minimal Pages context — only the fields the handler reads
  return { request, env } as Parameters<typeof onRequestPost>[0];
}

async function parseJSON(res: Response) {
  return res.json() as Promise<Record<string, unknown>>;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/waitlist', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 500 when env vars are missing', async () => {
    const ctx = makeCtx({ email: 'a@b.com', consent: true }, {});
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(500);
    const body = await parseJSON(res);
    expect(body.error).toBe('server_misconfigured');
  });

  it('returns 400 on invalid JSON body', async () => {
    const request = new Request('https://cinchcli.com/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    });
    const ctx = { request, env: { RESEND_API_KEY: 'k', RESEND_AUDIENCE_ID: 'a' } } as Parameters<typeof onRequestPost>[0];
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(400);
    const body = await parseJSON(res);
    expect(body.error).toBe('invalid_json');
  });

  it('silently accepts honeypot-filled submissions', async () => {
    const ctx = makeCtx({ email: 'bot@spam.com', consent: true, company: 'ACME Bot' });
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(200);
    const body = await parseJSON(res);
    expect(body.ok).toBe(true);
  });

  it('returns 400 on invalid email', async () => {
    const ctx = makeCtx({ email: 'not-an-email', consent: true });
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(400);
    const body = await parseJSON(res);
    expect(body.error).toBe('invalid_email');
  });

  it('returns 400 when consent is false', async () => {
    const ctx = makeCtx({ email: 'user@example.com', consent: false });
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(400);
    const body = await parseJSON(res);
    expect(body.error).toBe('consent_required');
  });

  it('returns 200 ok:true on successful signup and calls correct Resend endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', mockFetch);
    const ctx = makeCtx({ email: 'user@example.com', consent: true });
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(200);
    const body = await parseJSON(res);
    expect(body.ok).toBe(true);
    expect(body.duplicate).toBe(false);
    // Verify the correct Resend audience endpoint is called
    const [calledUrl] = mockFetch.mock.calls[0] as [string, ...unknown[]];
    expect(calledUrl).toBe('https://api.resend.com/audiences/aud-123/contacts');
  });

  it('returns 200 ok:true duplicate:true on 409 from Resend', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Contact already exists' }), { status: 409 }),
      ),
    );
    const ctx = makeCtx({ email: 'existing@example.com', consent: true });
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(200);
    const body = await parseJSON(res);
    expect(body.ok).toBe(true);
    expect(body.duplicate).toBe(true);
  });

  it('returns 502 when Resend returns an upstream error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 500 })));
    const ctx = makeCtx({ email: 'user@example.com', consent: true });
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(502);
    const body = await parseJSON(res);
    expect(body.error).toBe('upstream_failed');
  });
});
