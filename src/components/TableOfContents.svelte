<script lang="ts">
  /**
   * Article table of contents.
   *
   * Rendered as real anchors so it is a working list of links before this
   * island hydrates. Hydration only adds active-heading tracking.
   *
   * Note on the data shape: Astro's `headings` expose `slug`, not `id`. Passing
   * the raw objects through and reading `.id` yields `href="#undefined"` for
   * every entry — a silent failure that still renders a plausible-looking list.
   * The page maps them before handing them over; this component takes `id`.
   */
  import { onMount } from 'svelte';

  interface Heading {
    id: string;
    depth: number;
    text: string;
  }

  interface Props {
    headings: Heading[];
    label: string;
  }

  let { headings, label }: Props = $props();
  let activeId = $state('');

  onMount(() => {
    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (!targets.length) return;

    /*
     * Scroll position rather than IntersectionObserver visibility: the active
     * item should be the last heading scrolled past, which is a question about
     * position, not about what happens to be on screen. An observer marks a
     * short trailing section active the moment it appears at the bottom.
     */
    const OFFSET = 96;

    function update() {
      let current = targets[0].id;
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= OFFSET) current = el.id;
        else break;
      }
      activeId = current;
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  });
</script>

{#if headings.length > 1}
  <nav class="toc" aria-label={label}>
    <h2 class="label toc__head">{label}</h2>
    <ul>
      {#each headings as heading (heading.id)}
        <li class:is-sub={heading.depth === 3}>
          <a href={`#${heading.id}`} class:is-active={activeId === heading.id}>
            {heading.text}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  .toc {
    position: sticky;
    top: 6rem;
    border-left: 1px solid var(--rule);
    padding-left: 1.1rem;
  }

  .toc__head {
    display: block;
    margin-bottom: 0.9rem;
  }

  .toc ul {
    display: grid;
    gap: 0.55rem;
  }

  .toc li.is-sub {
    padding-left: 0.9rem;
  }

  .toc a {
    font-size: 0.8125rem;
    line-height: 1.45;
    color: var(--text-tertiary);
    transition: color var(--t-fast) var(--ease);
    display: block;
  }

  .toc a:hover,
  .toc a:focus-visible {
    color: var(--text-secondary);
  }

  .toc a.is-active {
    color: var(--text-primary);
  }
</style>
