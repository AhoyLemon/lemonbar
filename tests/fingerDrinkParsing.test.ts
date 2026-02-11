import { describe, it, expect } from "vitest";

// Test the finger drink ID parsing logic
describe("Finger Drink ID Parsing", () => {
  it("should correctly parse finger drink IDs with simple bottle IDs", () => {
    const drinkId = "finger-bottle1-straight";
    const withoutPrefix = drinkId.substring(7);
    const lastDashIndex = withoutPrefix.lastIndexOf("-");
    const servingStyle = withoutPrefix.substring(lastDashIndex + 1);
    const bottleId = withoutPrefix.substring(0, lastDashIndex);

    expect(bottleId).toBe("bottle1");
    expect(servingStyle).toBe("straight");
  });

  it("should correctly parse finger drink IDs with hyphenated bottle IDs", () => {
    const drinkId = "finger-bottle-31-straight";
    const withoutPrefix = drinkId.substring(7);
    const lastDashIndex = withoutPrefix.lastIndexOf("-");
    const servingStyle = withoutPrefix.substring(lastDashIndex + 1);
    const bottleId = withoutPrefix.substring(0, lastDashIndex);

    expect(bottleId).toBe("bottle-31");
    expect(servingStyle).toBe("straight");
  });

  it("should correctly parse finger drink IDs with rocks serving style", () => {
    const drinkId = "finger-bottle-31-rocks";
    const withoutPrefix = drinkId.substring(7);
    const lastDashIndex = withoutPrefix.lastIndexOf("-");
    const servingStyle = withoutPrefix.substring(lastDashIndex + 1);
    const bottleId = withoutPrefix.substring(0, lastDashIndex);

    expect(bottleId).toBe("bottle-31");
    expect(servingStyle).toBe("rocks");
  });

  it("should correctly parse finger drink IDs with multiple hyphens in bottle ID", () => {
    const drinkId = "finger-my-special-bottle-123-straight";
    const withoutPrefix = drinkId.substring(7);
    const lastDashIndex = withoutPrefix.lastIndexOf("-");
    const servingStyle = withoutPrefix.substring(lastDashIndex + 1);
    const bottleId = withoutPrefix.substring(0, lastDashIndex);

    expect(bottleId).toBe("my-special-bottle-123");
    expect(servingStyle).toBe("straight");
  });
});
