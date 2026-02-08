<template lang="pug">
.home-page
  .container
    .hero-section
      h1 Welcome to BOOZ
      p.lead The ultimate bar management system for cocktail enthusiasts and professional bartenders.
      .cta-section
        p Visit our demo bar to explore the features:
        NuxtLink.cta-button(to="/foo") Explore Demo Bar
        br
        NuxtLink.secondary-link(to="/about") Learn More About BOOZ
</template>

<script setup lang="ts">
  // Set page meta
  useHead({
    title: "BOOZ - Bar Management System",
    meta: [
      {
        name: "description",
        content: "BOOZ is a multi-tenant bar inventory and cocktail management platform for professional bartenders and cocktail enthusiasts.",
      },
    ],
  });
</script>

<style scoped lang="scss">
  @use "@/assets/styles/variables" as *;

  .hero-section {
    text-align: center;
    padding: $spacing-xxl 0;
    h1 {
      font-family: $font-heading;
      font-size: 3rem;
      color: $primary-color;
      margin-bottom: $spacing-md;
    }
    .lead {
      font-size: 1.25rem;
      color: $text-dark;
      max-width: 600px;
      margin: 0 auto $spacing-xl;
    }
  }

  .cta-section {
    p {
      font-size: 1.1rem;
      margin-bottom: $spacing-lg;
    }
  }

  .cta-button {
    display: inline-block;
    background-color: $primary-color;
    color: white;
    padding: $spacing-md $spacing-xl;
    border-radius: $border-radius-md;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-bottom: $spacing-md;
    &:hover {
      background-color: $secondary-color;
      transform: translateY(-2px);
    }
  }

  .secondary-link {
    color: $accent-color;
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: $breakpoint-md) {
    .hero-section h1 {
      font-size: 2rem;
    }
  }
</style>
