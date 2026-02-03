import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import type { Drink, DrinkData } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Drink>(event);

    // Validate required fields
    if (!body.name || !body.name.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name is required",
      });
    }

    if (!body.ingredients || body.ingredients.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "At least one ingredient is required",
      });
    }

    if (!body.instructions) {
      throw createError({
        statusCode: 400,
        statusMessage: "At least one instruction is required",
      });
    }

    // Validate instructions based on type
    const hasInstructions = Array.isArray(body.instructions) ? body.instructions.length > 0 : body.instructions.trim().length > 0;

    if (!hasInstructions) {
      throw createError({
        statusCode: 400,
        statusMessage: "At least one instruction is required",
      });
    }

    const drinksPath = join(process.cwd(), "public", "data", "drinks.json");
    const drinksData = JSON.parse(readFileSync(drinksPath, "utf-8")) as DrinkData;

    // Generate ID from name if not provided
    if (!body.id) {
      body.id = body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
    }

    // Check if ID already exists
    if (drinksData.drinks.some((d) => d.id === body.id)) {
      throw createError({
        statusCode: 409,
        statusMessage: `A drink with ID "${body.id}" already exists`,
      });
    }

    // Add the new drink
    drinksData.drinks.push(body);

    // Update lastUpdated timestamp
    drinksData.lastUpdated = new Date().toISOString();

    // Write back to file
    writeFileSync(drinksPath, JSON.stringify(drinksData, null, 2));

    return {
      success: true,
      drink: body,
    };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create drink: ${errorMessage}`,
    });
  }
});
