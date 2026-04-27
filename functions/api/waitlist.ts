interface Env {
  RESEND_API_KEY?: string;
  RESEND_AUDIENCE_ID?: string;
}

interface WaitlistPayload {
  email?: string;
  consent?: boolean;
  company?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID) {
    return jsonResponse(
      {
        ok: false,
        error: 'server_misconfigured',
      },
      500,
    );
  }

  let payload: WaitlistPayload;
  try {
    payload = (await request.json()) as WaitlistPayload;
  } catch {
    return jsonResponse(
      {
        ok: false,
        error: 'invalid_json',
      },
      400,
    );
  }

  const email = String(payload.email ?? '').trim().toLowerCase();
  const honeypot = String(payload.company ?? '').trim();
  const consent = payload.consent === true;

  // Silently accept bot submissions to avoid signal leakage.
  if (honeypot) {
    return jsonResponse({ ok: true, duplicate: false });
  }

  if (!EMAIL_REGEX.test(email)) {
    return jsonResponse(
      {
        ok: false,
        error: 'invalid_email',
      },
      400,
    );
  }

  if (!consent) {
    return jsonResponse(
      {
        ok: false,
        error: 'consent_required',
      },
      400,
    );
  }

  const createContactBody = {
    email,
    unsubscribed: false,
  };

  const resendResponse = await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'User-Agent': 'cinch-waitlist/1.0',
    },
    body: JSON.stringify(createContactBody),
  });

  if (resendResponse.ok) {
    return jsonResponse({ ok: true, duplicate: false });
  }

  let resendErrorMessage = '';
  try {
    const errorBody = (await resendResponse.json()) as { message?: string };
    resendErrorMessage = String(errorBody?.message ?? '').toLowerCase();
  } catch {
    resendErrorMessage = '';
  }

  // Treat duplicate contact as a successful waitlist join.
  if (
    resendResponse.status === 409 ||
    resendErrorMessage.includes('already') ||
    resendErrorMessage.includes('exists')
  ) {
    return jsonResponse({ ok: true, duplicate: true });
  }

  return jsonResponse(
    {
      ok: false,
      error: 'upstream_failed',
    },
    502,
  );
};
