import { ValueObject } from "./value-object";

export class AbstractValueObject<T> implements ValueObject<T> {
    constructor(
        public readonly value: T
    ) {
        this.validate();
    }

    protected validate(): void {
        return;
    }

    equals(valueObject: ValueObject<T>): boolean {
        return this.value === valueObject.value;
    }
}
