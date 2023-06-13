import { AbstractValueObject } from "./abstract.value-object";

export class SingleLineOfText extends AbstractValueObject<string> {
    protected validate(): void {
        if (this.value === null) {
            throw new Error("A single line of text cannot be null");
        }

        if (this.value === undefined) {
            throw new Error("A single line of text cannot be undefined");
        }

        if (typeof this.value !== "string") {
            throw new Error("A single line of text must be a string");
        }

        if (this.value.includes('"')) {
            throw new Error("A single line of text cannot contain double quotes");
        }

        if (this.value.includes("\\")) {
            throw new Error("A single line of text cannot contain backslashes");
        }
    }
}
