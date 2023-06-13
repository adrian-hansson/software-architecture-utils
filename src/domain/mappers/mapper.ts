export interface Mapper<TFrom, TTo> {
    map(from: TFrom): TTo;
}
