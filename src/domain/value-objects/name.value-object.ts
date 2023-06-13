import { SingleLineOfText } from "./single-line-of-text.value-object";

export class Name extends SingleLineOfText {
    protected override validate(): void {
        super.validate();

        if (!this.value) {
            throw new Error("Name is required");
        }
    }
}
