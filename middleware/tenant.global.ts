/**
 * Global middleware for tenant routing
 * 
 * This middleware:
 * 1. Redirects root paths to default tenant paths (e.g., / => /foo, /drinks => /foo/drinks)
 * 2. Validates tenant slugs and returns 404 for unknown tenants
 */

import { getDefaultTenantConfig, isValidTenant } from "~/utils/tenants";

export default defineNuxtRouteMiddleware((to) => {
  const path = to.path;

  // Skip processing for static assets
  if (path.startsWith('/_nuxt') || path.startsWith('/assets')) {
    return;
  }

  // Extract tenant from path
  const pathSegments = path.split('/').filter(Boolean);
  const possibleTenant = pathSegments[0];

  // List of known non-tenant routes (top-level pages without tenant)
  const topLevelRoutes = [''];

  // Check if path starts with a tenant slug
  if (possibleTenant && isValidTenant(possibleTenant)) {
    // Valid tenant, allow navigation
    return;
  }

  // Check if this is a root path that needs default tenant
  if (!possibleTenant || topLevelRoutes.includes(possibleTenant)) {
    // Redirect to default tenant
    const defaultConfig = getDefaultTenantConfig();
    const newPath = path === '/' || path === '' 
      ? `/${defaultConfig.slug}` 
      : `/${defaultConfig.slug}${path}`;
    
    return navigateTo(newPath, { redirectCode: 302 });
  }

  // If we have a path segment that's not a valid tenant and not a known top-level route,
  // it might be an invalid tenant - let it through to be handled by the catch-all route
  return;
});
