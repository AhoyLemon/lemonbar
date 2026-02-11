import { isValidTenant } from "~/utils/tenants";

/**
 * Validates that the tenant from the route is valid
 * Throws a 404 error if the tenant is invalid
 * @returns The validated tenant slug
 */
export function useValidateTenant() {
  const route = useRoute();
  const tenant = computed(() => route.params.tenant as string);

  // Validate tenant exists
  if (!isValidTenant(tenant.value)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found",
      fatal: false,
    });
  }

  return tenant;
}
