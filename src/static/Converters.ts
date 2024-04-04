export class Converters {
    private constructor() {
        throw new Error("ColorCodes cannot be instantiated.");
    }
    
    static capitalizeFirstLetter(s: string): string {
        return s[0].toUpperCase() + s.slice(1);
    }
}