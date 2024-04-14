export class Converters {
  private constructor() {
    throw new Error("ColorCodes cannot be instantiated.");
  }

  static capitalizeFirstLetter(s: string): string {
    const items = s
      .toLowerCase()
      .split(/[\s-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

    return items.join(s.includes("-") ? "-" : " ");
  }
}
