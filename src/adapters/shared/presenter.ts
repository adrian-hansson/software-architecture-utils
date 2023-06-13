export interface Presenter<TInput, TPresentation> {
    present(input: TInput): TPresentation;
}
