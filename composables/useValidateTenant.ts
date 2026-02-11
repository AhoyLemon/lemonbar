import { isValidTenant } from "~/utils/tenants";

/**
 * Validates that the tenant from the route is valid
 * Throws a 404 error if the tenant is invalid
 * 
 * Note: In Nuxt, page components are recreated on route changes,
 * so this validation runs fresh for each navigation.
 * 
 * @returns The validated tenant slug
 */
export function useValidateTenant() {
  const route = useRoute();
  const tenant = computed(() => route.params.tenant as string);

  // Validate tenant exists - runs on component creation (each route navigation)
  if (!isValidTenant(tenant.value)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found",
      fatal: false,
    });
  }

  return tenant;
}
