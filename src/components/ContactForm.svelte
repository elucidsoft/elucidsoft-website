<script lang="ts">
  /**
   * Contact form, submitting to Web3Forms.
   *
   * Progressive enhancement is the whole design. The markup is a real <form>
   * with a real `action`, so with JavaScript unavailable it POSTs natively and
   * the hidden `redirect` field returns the visitor to ?sent=1, which is read
   * on mount and reported. With JavaScript, the same submit is intercepted and
   * sent by fetch so the page never navigates.
   *
   * `botcheck` is Web3Forms' honeypot: it is positioned offscreen, hidden from
   * assistive technology and removed from the tab order, so only a script that
   * fills every field will trip it. No CAPTCHA, no third-party frame.
   *
   * No email address appears anywhere in the markup — the reason the form
   * exists rather than a mailto: link.
   */
  import { onMount } from 'svelte';

  interface Props {
    endpoint: string;
    accessKey: string;
    redirectTo: string;
    subjectPrefix: string;
    labels: {
      name: string;
      email: string;
      subject: string;
      message: string;
      submit: string;
      sending: string;
      sent: string;
      error: string;
    };
  }

  let { endpoint, accessKey, redirectTo, subjectPrefix, labels }: Props = $props();

  let status = $state('');
  let busy = $state(false);
  let form: HTMLFormElement;

  onMount(() => {
    if (new URLSearchParams(location.search).get('sent') === '1') {
      status = labels.sent;
    }
  });

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    busy = true;
    status = labels.sending;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        form.reset();
        status = labels.sent;
      } else {
        status = labels.error;
      }
    } catch {
      status = labels.error;
    } finally {
      busy = false;
    }
  }
</script>

<form bind:this={form} class="form" action={endpoint} method="POST" onsubmit={submit}>
  <input type="hidden" name="access_key" value={accessKey} />
  <input type="hidden" name="from_name" value="Elucidsoft LLC website" />
  <input type="hidden" name="redirect" value={redirectTo} />

  <input
    type="checkbox"
    name="botcheck"
    class="form__honeypot"
    tabindex="-1"
    autocomplete="off"
    aria-hidden="true"
  />

  <div class="form__field">
    <label class="label" for="contact-name">{labels.name}</label>
    <input id="contact-name" name="name" type="text" required autocomplete="name" />
  </div>

  <div class="form__field">
    <label class="label" for="contact-email">{labels.email}</label>
    <input id="contact-email" name="email" type="email" required autocomplete="email" />
  </div>

  <div class="form__field">
    <label class="label" for="contact-subject">{labels.subject}</label>
    <input
      id="contact-subject"
      name="subject"
      type="text"
      required
      value={subjectPrefix}
    />
  </div>

  <div class="form__field">
    <label class="label" for="contact-message">{labels.message}</label>
    <textarea id="contact-message" name="message" rows="7" required></textarea>
  </div>

  <div class="form__actions">
    <button type="submit" class="btn" disabled={busy}>{labels.submit}</button>
    <p class="form__status mono" aria-live="polite">{status}</p>
  </div>
</form>

<style>
  .form {
    display: grid;
    gap: clamp(1.4rem, 3vw, 1.9rem);
  }

  /* Offscreen rather than display:none — some bots skip fields that are not
     rendered at all, which defeats the point of the trap. */
  .form__honeypot {
    position: absolute;
    left: -9999px;
    opacity: 0;
    height: 0;
    width: 0;
  }

  .form__field {
    display: grid;
    gap: 0.55rem;
  }

  /*
   * Inputs are a single bottom rule, not a boxed field. It matches the ruled
   * language of the rest of the site, and it keeps the form from reading as a
   * widget dropped onto the page.
   */
  .form input[type='text'],
  .form input[type='email'],
  .form textarea {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--rule-strong);
    border-radius: 0;
    padding: 0.55rem 0;
    font-family: var(--font-body);
    font-size: 1.0625rem;
    color: var(--text-primary);
    resize: vertical;
    transition: border-color var(--t-fast) var(--ease);
  }

  .form input:focus,
  .form textarea:focus {
    outline: none;
    border-bottom-color: var(--brand-periwinkle);
  }

  .form input:focus-visible,
  .form textarea:focus-visible {
    outline: none;
  }

  .form__actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.25rem;
    margin-top: 0.5rem;
  }

  .form__status {
    font-size: var(--label-size);
    letter-spacing: var(--label-tracking);
    text-transform: uppercase;
    color: var(--text-tertiary);
    min-height: 1.2em;
  }
</style>
