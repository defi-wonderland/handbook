import { generateAuthors, ALIASES, NAME_OVERRIDES } from "./generate-authors";

describe("generate-authors", () => {
  let result: Record<string, any>;

  beforeAll(async () => {
    result = await generateAuthors();
  }, 30000);

  test("should return an object with authors", () => {
    expect(typeof result).toBe("object");
    expect(result).not.toBeNull();
  });

  test("should generate expected number of authors", async () => {
    const response = await fetch(
      "https://raw.githubusercontent.com/defi-wonderland/web/dev/src/data/squad.json"
    );
    const squad = await response.json();
    const expectedCount = squad.length;

    const actualCount = Object.keys(result).length;
    expect(actualCount).toBe(expectedCount);
  });

  test("every author should have a name", () => {
    const authorKeys = Object.keys(result);
    expect(authorKeys.length).toBeGreaterThan(0);

    for (const slug of authorKeys) {
      const author = result[slug];
      expect(author).toBeDefined();
      expect(author.name).toBeDefined();
      expect(typeof author.name).toBe("string");
      expect(author.name.trim().length).toBeGreaterThan(0);
    }
  });

  test("specific author should have all expected fields", () => {
    const authorKeys = Object.keys(result);
    const testSlug = authorKeys[0];
    const author = result[testSlug];

    expect(author.name).toBeDefined();
    expect(typeof author.name).toBe("string");

    if (author.title) {
      expect(typeof author.title).toBe("string");
    }

    if (author.description) {
      expect(typeof author.description).toBe("string");
      expect(author.description).not.toMatch(/\n/);
    }

    if (author.image_url) {
      expect(typeof author.image_url).toBe("string");
      expect(author.image_url).toMatch(
        /^https:\/\/raw\.githubusercontent\.com/
      );
    }
  });

  test("name overrides should be applied correctly", () => {
    for (const [slug, expectedName] of Object.entries(NAME_OVERRIDES)) {
      if (result[slug]) {
        expect(result[slug].name).toBe(expectedName);
      }
    }
  });

  test("aliases should be applied correctly", () => {
    for (const [originalSlug, targetSlug] of Object.entries(ALIASES)) {
      // Should not have the original slug
      expect(result[originalSlug]).toBeUndefined();
      // Should have the target slug (if the person exists in squad)
      if (result[targetSlug]) {
        expect(result[targetSlug]).toBeDefined();
        expect(result[targetSlug].name).toBeDefined();
      }
    }
  });

  test("no author should have empty values", () => {
    for (const [slug, author] of Object.entries(result)) {
      for (const [field, value] of Object.entries(author)) {
        expect(value).not.toBe("");
        expect(value).not.toBeNull();
        expect(value).not.toBeUndefined();
      }
    }
  });

  test("image URLs should be properly formatted", () => {
    const authorsWithImages = Object.entries(result).filter(
      ([, author]) => author.image_url
    );

    expect(authorsWithImages.length).toBeGreaterThan(0);

    for (const [slug, author] of authorsWithImages) {
      expect(author.image_url).toMatch(
        /^https:\/\/raw\.githubusercontent\.com\/defi-wonderland\/web\/dev\/public\/img\/pfp\/.+\.(png|jpg|jpeg|webp|svg)$/
      );
    }
  });
});
