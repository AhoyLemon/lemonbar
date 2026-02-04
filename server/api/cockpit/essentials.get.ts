import { fetchEssentialsFromCockpit } from "~/server/utils/cockpitHelper";
import type { EssentialsData } from "~/types";

export default defineEventHandler(async (): Promise<EssentialsData> => {
  try {
    const essentials = await fetchEssentialsFromCockpit();
    return {
      essentials,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch essentials from Cockpit: ${errorMessage}`,
    });
  }
});
