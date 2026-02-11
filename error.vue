<template lang="pug">
.error-page
  .container
    .error-banner
      .error-icon {{ errorIcon }}
      .error-content
        h1 {{ errorTitle }}
        p {{ errorMessage }}
        p.error-explanation(v-if="errorExplanation") {{ errorExplanation }}
        
        // Suggestion for missing tenant in URL
        .suggestion-box(v-if="suggestedTenantUrl")
          p Did you mean:
          NuxtLink(:to="suggestedTenantUrl" class="btn-primary") {{ suggestedTenantUrl }}
        
        // Show available tenants for invalid tenant
        .sample-tenants(v-else-if="showAvailableTenants && availableTenants.length > 0")
          p Available bars:
          ul
            li(v-for="slug in availableTenants" :key="slug")
              NuxtLink(:to="`/${slug}`") {{ getTenantName(slug) }}
        
        // Generic help for unknown pages
        .help-links(v-else)
          p You might want to:
          ul
            li
              NuxtLink(to="/") Go to the home page
            li
              NuxtLink(to="/sample") Explore our Sample Bar
</template>

<script setup lang="ts">
  import { getTenantConfig, isValidTenant, getSampleDataTenantSlugs, TENANT_CONFIG } from "~/utils/tenants";

  // Define props from Nuxt's error object
  const props = defineProps({
    error: Object,
  });

  // Get the current route path
  const route = useRoute();
  const requestedPath = computed(() => props.error?.url || route.path || "");

  // Parse the requested path to detect tenant-related issues
  const pathSegments = computed(() => requestedPath.value.split("/").filter(Boolean));
  const possibleTenant = computed(() => pathSegments.value[0] || "");
  const remainingPath = computed(() => 
    pathSegments.value.length > 1 ? "/" + pathSegments.value.slice(1).join("/") : ""
  );

  // Define known page routes (tenant-based pages)
  const knownTenantPages = ["drinks", "bottles", "available", "essentials", "beer-wine", "fingers", "qr"];

  // Determine the error scenario
  const errorScenario = computed(() => {
    const tenant = possibleTenant.value;
    const path = requestedPath.value;

    // Scenario 1: Missing tenant (e.g., /drinks instead of /sample/drinks)
    if (knownTenantPages.includes(tenant)) {
      return "missing-tenant";
    }

    // Scenario 2: Invalid tenant (e.g., /badtenant or /badtenant/drinks)
    if (tenant && !isValidTenant(tenant)) {
      return "invalid-tenant";
    }

    // Scenario 3: Generic 404
    return "not-found";
  });

  // Configure error display based on scenario
  const errorIcon = computed(() => {
    switch (errorScenario.value) {
      case "missing-tenant":
        return "🔗";
      case "invalid-tenant":
        return "🚫";
      default:
        return "❓";
    }
  });

  const errorTitle = computed(() => {
    switch (errorScenario.value) {
      case "missing-tenant":
        return "Missing Bar Name";
      case "invalid-tenant":
        return "Bar Not Found";
      default:
        return "Page Not Found";
    }
  });

  const errorMessage = computed(() => {
    switch (errorScenario.value) {
      case "missing-tenant":
        return `The page "${requestedPath.value}" is missing a bar name.`;
      case "invalid-tenant":
        return `The bar "${possibleTenant.value}" could not be found.`;
      default:
        return `The page "${requestedPath.value}" does not exist.`;
    }
  });

  const errorExplanation = computed(() => {
    switch (errorScenario.value) {
      case "missing-tenant":
        return "BOOZ requires a bar name in the URL (e.g., /sample/drinks instead of /drinks).";
      case "invalid-tenant":
        return "This might happen if you mistyped the URL or if the bar has been removed.";
      default:
        return "The page you're looking for might have been moved or doesn't exist.";
    }
  });

  // Suggest correct URL for missing tenant scenario
  const suggestedTenantUrl = computed(() => {
    if (errorScenario.value === "missing-tenant") {
      return `/sample${requestedPath.value}`;
    }
    return null;
  });

  // Show available tenants for invalid tenant scenario
  const showAvailableTenants = computed(() => errorScenario.value === "invalid-tenant");

  const availableTenants = computed(() => {
    // Show all tenants including sample data
    return Object.keys(TENANT_CONFIG);
  });

  const getTenantName = (slug: string) => {
    const config = getTenantConfig(slug);
    return config ? config.barName : slug;
  };

  // Set status code
  const statusCode = computed(() => props.error?.statusCode || 404);
</script>

<style lang="scss" scoped>
  @use "sass:color";
  @use "@/assets/styles/variables" as *;

  .error-page {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-lg;

    .container {
      max-width: 600px;
      width: 100%;
    }
  }

  .error-banner {
    background: linear-gradient(135deg, #dc3545 0%, color.adjust(#dc3545, $lightness: -10%) 100%);
    color: white;
    padding: $spacing-xl;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-lg;
    text-align: center;

    .error-icon {
      font-size: 4rem;
      margin-bottom: $spacing-md;
    }

    .error-content {
      h1 {
        color: white;
        font-size: 2rem;
        margin: 0 0 $spacing-md 0;
      }

      p {
        color: rgba(255, 255, 255, 0.95);
        margin-bottom: $spacing-md;
        font-size: 1.125rem;
      }

      .error-explanation {
        color: rgba(255, 255, 255, 0.8);
        font-size: 1rem;
        margin-bottom: $spacing-lg;
        font-style: italic;
      }

      .suggestion-box,
      .sample-tenants,
      .help-links {
        background: rgba(0, 0, 0, 0.2);
        padding: $spacing-md;
        border-radius: $border-radius-md;
        margin: $spacing-lg 0;

        p {
          margin-bottom: $spacing-sm;
          font-weight: 600;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: left;

          li {
            margin: $spacing-xs 0;

            a {
              color: white;
              text-decoration: none;
              padding: $spacing-xs $spacing-sm;
              display: inline-block;
              border-radius: $border-radius-sm;
              transition: background-color 0.2s;

              &:hover {
                background: rgba(255, 255, 255, 0.2);
              }
            }
          }
        }

        .btn-primary {
          display: inline-block;
          background: white;
          color: #dc3545;
          padding: $spacing-sm $spacing-lg;
          border-radius: $border-radius-md;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
          margin-top: $spacing-sm;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
        }
      }
    }
  }
</style>
