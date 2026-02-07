<template lang="pug">
.site-layout
  header.app-header
    .container
      .site-name {{ barName }}
    .nav-holder
      nav
        NuxtLink.nav-link(:to="tenantPath('/')" :class="{ active: isActive('/') }") Home
        NuxtLink.nav-link(:to="tenantPath('/bottles')" :class="{ active: isActive('/bottles') }") Bottles
        NuxtLink.nav-link(:to="tenantPath('/drinks')" :class="{ active: isActive('/drinks') }") Drinks
        NuxtLink.nav-link(:to="tenantPath('/essentials')" :class="{ active: isActive('/essentials') }") Essentials
        NuxtLink.nav-link(:to="tenantPath('/beer-wine')" :class="{ active: isActive('/beer-wine') }") Beer & Wine
        NuxtLink.nav-link(:to="tenantPath('/fingers')" :class="{ active: isActive('/fingers') }") Fingers
        NuxtLink.nav-link(:to="tenantPath('/available')" :class="{ active: isActive('/available') }") Available
      
  main
    DummyDataNotice(v-if="isDefaultTenant")
    slot
  footer.app-footer
    .container
      p by 
        a(href="https://ahoylemon.xyz") Lemon
</template>

<script setup lang="ts">
  import DummyDataNotice from "~/components/DummyDataNotice.vue";
  import { getTenantConfig, getDefaultTenantConfig } from "~/utils/tenants";

  const route = useRoute();

  // Extract tenant from route
  const tenant = computed(() => {
    const pathSegments = route.path.split("/").filter(Boolean);
    // Fallback to default tenant slug as safety measure (middleware should handle redirects)
    return pathSegments[0] || getDefaultTenantConfig().slug;
  });

  // Get tenant config
  const tenantConfig = computed(() => {
    return getTenantConfig(tenant.value) || getDefaultTenantConfig();
  });

  const barName = computed(() => tenantConfig.value.barName);
  const isDefaultTenant = computed(() => tenant.value === getDefaultTenantConfig().slug);

  // Helper to construct tenant-aware paths
  const tenantPath = (path: string) => {
    const tenantSlug = tenant.value;
    // Remove leading slash from path if present
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `/${tenantSlug}${cleanPath ? "/" + cleanPath : ""}`;
  };

  // Helper to check if route is active
  const isActive = (path: string) => {
    const tenantSlug = tenant.value;
    const fullPath = `/${tenantSlug}${path === "/" ? "" : path}`;

    if (path === "/") {
      return route.path === fullPath;
    }
    return route.path.startsWith(fullPath);
  };
</script>
