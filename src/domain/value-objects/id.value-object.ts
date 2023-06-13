import { AbstractValueObject } from "./abstract.value-object";

export class Id extends AbstractValueObject<string> {
    protected validate(): void {
        if (!this.value) {
            throw new Error("Id is required");
        }

        if (this.value.includes(" ")) {
            throw new Error("Id cannot contain spaces");
        }

        if (this.value.includes('"')) {
            throw new Error("Id cannot contain double quotes");
        }

        if (this.value.includes("'")) {
            throw new Error("Id cannot contain single quotes");
        }

        if (this.value.includes("\\")) {
            throw new Error("Id cannot contain backslashes");
        }

        if (this.value.includes("/")) {
            throw new Error("Id cannot contain forward slashes");
        }

        if (this.value.includes("?")) {
            throw new Error("Id cannot contain question marks");
        }
    }
}
