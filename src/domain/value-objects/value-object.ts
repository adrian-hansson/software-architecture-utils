export interface ValueObject<T> {
    readonly value: T;
    equals(valueObject: ValueObject<T>): boolean;
}
