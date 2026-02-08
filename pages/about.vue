<template lang="pug">
.about-page
  .container
    .hero-section
      h1 Welcome to BOOZ
      p.lead The ultimate bar management system for cocktail enthusiasts and professional bartenders.

    .features-section
      h2 What is BOOZ?
      p BOOZ is a multi-tenant bar inventory and cocktail management platform built with Nuxt 3. Each bar gets their own dedicated space to manage their inventory, create custom cocktails, and track what's available right now.

    .demo-section
      h2 Try the Demo
      p Explore our demo bar to see BOOZ in action. Check out the inventory, browse cocktails, and see what's available.
      .demo-links
        NuxtLink.demo-card(to="/foo/bottles")
          h3 Bottles
          p View spirits, liquors, and mixers
        NuxtLink.demo-card(to="/foo/drinks")
          h3 Drinks
          p Browse special and common cocktails
        NuxtLink.demo-card(to="/foo/fingers")
          h3 Fingers
          p Bottles served straight or on the rocks
        NuxtLink.demo-card(to="/foo/available")
          h3 Available Now
          p What's ready to drink right now

    .contact-section
      h2 Open Your Own Bar
      p Ready to manage your bar's inventory and cocktails? Contact Lemon to set up your own BOOZ instance.
      .contact-info
        p Email: 
          a(href="mailto:lemon@ahoylemon.xyz") lemon@ahoylemon.xyz
        p Website: 
          a(href="https://ahoylemon.xyz" target="_blank") ahoylemon.xyz
        p GitHub: 
          a(href="https://github.com/ahoylemon/booz" target="_blank") github.com/ahoylemon/booz
</template>

<script setup lang="ts">
  // Set page meta
  useHead({
    title: "About BOOZ - Bar Management System",
    meta: [
      {
        name: "description",
        content: "Learn about BOOZ, the multi-tenant bar inventory and cocktail management platform for professional bartenders and cocktail enthusiasts.",
      },
    ],
  });
</script>

<style scoped lang="scss">
  @use "@/assets/styles/variables" as *;

  .about-page {
    padding: $spacing-xl 0;
  }

  .hero-section {
    text-align: center;
    margin-bottom: $spacing-xxl;
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
      margin: 0 auto;
    }
  }

  .features-section,
  .demo-section,
  .contact-section {
    margin-bottom: $spacing-xxl;
    h2 {
      font-family: $font-heading;
      font-size: 2rem;
      color: $secondary-color;
      margin-bottom: $spacing-lg;
      text-align: center;
    }
    p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: $text-dark;
      max-width: 800px;
      margin: 0 auto $spacing-lg;
      text-align: center;
    }
  }

  .demo-links {
    display: flex;
    gap: $spacing-lg;
    justify-content: center;
    flex-wrap: wrap;
  }

  .demo-card {
    background-color: white;
    padding: $spacing-xl;
    border-radius: $border-radius-lg;
    text-align: center;
    flex-basis: 250px;
    color: $text-dark;
    text-decoration: none;
    box-shadow: $shadow-sm;
    transition: all 0.3s ease;
    &:hover {
      box-shadow: $shadow-lg;
      transform: translateY(-0.25rem);
      color: $primary-color;
    }
    h3 {
      font-size: 1.5rem;
      margin-bottom: $spacing-sm;
    }
    p {
      font-size: 0.9rem;
      color: #666;
    }
  }

  .contact-section {
    .contact-info {
      text-align: center;
      p {
        margin-bottom: $spacing-sm;
        a {
          color: $accent-color;
          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  @media (max-width: $breakpoint-md) {
    .hero-section h1 {
      font-size: 2rem;
    }
    .demo-links {
      flex-direction: column;
      align-items: center;
    }
    .demo-card {
      flex-basis: 100%;
      max-width: 300px;
    }
  }
</style>
