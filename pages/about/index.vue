<template lang="pug" src="./index.pug"></template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { usePageMeta } from "~/composables/usePageMeta";
  import { useRuntimeConfig, useHead } from "#app";
  import staticSchema from "~/utils/schema/boozSchema.json";

  // Set page meta (SSR-friendly)
  usePageMeta({
    pageType: "about",
    title: "About BOOZ",
    description: "BOOZ is your new favorite way for you to manage inventory in cocktails in your home bar. Check out a demo and see how it works.",
  });

  // Modal state and behaviour for screenshot lightbox
  const modalOpen = ref(false);
  const currentSrc = ref("");
  const currentAlt = ref("");
  const modalLabel = ref("Screenshot viewer");
  let lastFocused: HTMLElement | null = null;

  // Use the static JSON-LD file by default
  const ldJson = ref<string>(JSON.stringify(staticSchema, null, 2));

  // Inject JSON-LD into the end of the document body (non-blocking)
  useHead({
    // cast to any because the head type definitions are conservative about script children
    script: [{ type: "application/ld+json", children: ldJson.value, body: true } as unknown as any],
  });

  const openModal = (src: string, alt: string, ev?: Event) => {
    if (ev && typeof (ev as Event).preventDefault === "function") (ev as Event).preventDefault();
    lastFocused = document.activeElement as HTMLElement | null;
    currentSrc.value = src;
    currentAlt.value = alt;
    modalOpen.value = true;
    // focus the close button after DOM updates
    setTimeout(() => {
      const btn = document.querySelector("#screenshot-modal .close-button") as HTMLElement | null;
      if (btn) btn.focus();
    }, 0);
  };

  // Helper to open modal from an event that contains data attributes
  const openModalFromEvent = (ev?: Event) => {
    if (!ev) return;
    const target = ev.currentTarget as Element | null;
    if (!target) return;
    const src = target.getAttribute("data-full") ?? "";
    const alt = target.getAttribute("data-alt") ?? "";
    openModal(src, alt, ev);
  };
  const closeModal = () => {
    modalOpen.value = false;
    currentSrc.value = "";
    currentAlt.value = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && modalOpen.value) closeModal();
  };

  onMounted(() => document.addEventListener("keydown", onKey));
  onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
</script>
