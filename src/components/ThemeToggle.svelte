<script lang="ts">
  /**
   * Dark/light theme toggle.
   * Uses clean vector SVG icons for pixel-perfect alignment.
   */
  import { onMount } from 'svelte';

  let theme: 'dark' | 'light' = $state('dark');
  let mounted = $state(false);

  onMount(() => {
    theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    mounted = true;
  });

  function toggle() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('elucid-theme', theme);
    } catch (e) {
      /* Storage unavailable; the choice simply does not persist. */
    }
  }
</script>

<button
  type="button"
  class="toggle"
  onclick={toggle}
  aria-label={mounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme` : 'Switch theme'}
  aria-pressed={mounted ? theme === 'light' : undefined}
  title={mounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme` : 'Switch theme'}
>
  {#if theme === 'dark'}
    <!-- Sun icon for switching to light theme -->
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  {:else}
    <!-- Moon icon for switching to dark theme -->
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  {/if}
</button>

<style>
  .toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    margin: 0;
    background: transparent;
    border: 1px solid var(--rule);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    cursor: pointer;
    line-height: 1;
    vertical-align: middle;
    transition:
      color var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease),
      background-color var(--t-fast) var(--ease),
      transform var(--t-fast) var(--ease);
  }

  .toggle:hover,
  .toggle:focus-visible {
    color: var(--text-primary);
    border-color: var(--rule-strong);
    background: var(--surface-raised);
    transform: translateY(-1px);
  }

  .toggle svg {
    display: block;
    flex-shrink: 0;
  }
</style>
