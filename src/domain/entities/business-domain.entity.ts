import { ApplicationDto } from "../dto/application.dto";
import { IntegrationDto } from "../dto/integration.dto";
import { RequirementDto } from "../dto/requirement.dto";
import { Id } from "../value-objects/id.value-object";
import { Name } from "../value-objects/name.value-object";

export class BusinessDomainEntity {
    constructor(
        public readonly id: Id,
        public readonly name: Name,
        public readonly applications: ApplicationDto[],
        public readonly integrations: IntegrationDto[],
        public readonly childBusinessDomains: BusinessDomainEntity[],
        public readonly relatedRequirements: RequirementDto[]
    ) {}

    public get allApplications(): ApplicationDto[] {
        return [
            ...this.applications,
            ...this.childBusinessDomains.flatMap(childBusinessDomain => childBusinessDomain.applications)
        ];
    }

    public get allIntegrations(): IntegrationDto[] {
        return [
            ...this.integrations,
            ...this.childBusinessDomains.flatMap(childBusinessDomain => childBusinessDomain.integrations)
        ];
    }

    public get allRequirements(): RequirementDto[] {
        return [
            ...this.relatedRequirements,
            ...this.childBusinessDomains.flatMap(childBusinessDomain => childBusinessDomain.relatedRequirements)
        ];
    }
}
