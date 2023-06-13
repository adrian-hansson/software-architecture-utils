export interface IntegrationDto {
    readonly fromApplicationId: string;
    readonly toApplicationId: string;
    readonly trigger: string;
    readonly method: string;
    readonly action: string;
    readonly relatedRequirement?: string;
}
