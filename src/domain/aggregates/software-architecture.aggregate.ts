import { IntegrationDto } from "../dto/integration.dto";
import { ApplicationEntity } from "../entities/application.entity";
import { BusinessDomainEntity } from "../entities/business-domain.entity";
import { IntegrationEntity } from "../entities/integration.entity";
import { RequirementEntity } from "../entities/requirement.entity";
import { DomainError } from "../errors/domain.error";
import { ApplicationDtoToApplicationEntityMapper } from "../mappers/application-dto-to-application-entity.mapper";
import { BusinessDomainDtoToEntityMapper } from "../mappers/business-domain-dto-to-entity.mapper";
import { IntegrationDtoToIntegrationEntityMapper } from "../mappers/integration-dto-to-integration-entity.mapper";
import { RequirementDtoToEntityMapper } from "../mappers/requirement-dto-to-entity.mapper";
import { SoftwareArchitectureRepository } from "../repositories/software-architecture.repository";
import { Id } from "../value-objects/id.value-object";

export class SoftwareArchitectureAggregate {
    
    private constructor (
        public readonly applications: ApplicationEntity[],
        public readonly integrations: IntegrationEntity[],
        public readonly requirements: RequirementEntity[],
        public readonly businessDomains: BusinessDomainEntity[]
    ) {
        this.validate();
    }

    private validateApplications(): void {
        const applicationIds = this.applications.map(application => application.id.value);

        const duplicatedApplicationIds = applicationIds.filter((applicationId, index) => {
            return applicationIds.indexOf(applicationId) !== index;
        });

        if (duplicatedApplicationIds.length > 0) {
            throw new DomainError(`Duplicated application ids: ${duplicatedApplicationIds.join(', ')}`);
        }

        const integrationApplicationIds = this.integrations.map(integration => integration.fromApplicationId.value);

        const missingApplicationIds = integrationApplicationIds.filter(integrationApplicationId => {
            return !applicationIds.includes(integrationApplicationId);
        });

        if (missingApplicationIds.length > 0) {
            throw new DomainError(`Missing application ids: ${missingApplicationIds.join(', ')}`);
        }
    }

    private validateIntegrations(): void {
        const applicationIds = this.applications.map(application => application.id.value);
        const missingApplicationIds = this.integrations.filter(integration => {
            return !applicationIds.includes(integration.toApplicationId.value);
        }).map(integration => integration.toApplicationId.value);

        if (missingApplicationIds.length > 0) {
            const errorMessage: string = `Missing application ids: ${missingApplicationIds.join(', ')}`;
            // console.error(errorMessage);
            throw new DomainError(errorMessage);
        }
    }

    private validate(): void {
        this.validateApplications();
        this.validateIntegrations();
    }

    private getAllBusinessDomains(businessDomains: BusinessDomainEntity[]): BusinessDomainEntity[] {
        const allBusinessDomains = businessDomains.flatMap(businessDomain => {
            return [
                businessDomain,
                ...this.getAllBusinessDomains(businessDomain.childBusinessDomains)
            ];
        });

        return allBusinessDomains;
    }

    public get allBusinessDomains(): BusinessDomainEntity[] {
        return this.getAllBusinessDomains(this.businessDomains);
    }

    private getActiveApplications(applications: ApplicationEntity[], applicationIdFilter?: Id[]): ApplicationEntity[] {
        const applicationsWithIntegrationsIds = [
            ...this.integrations.map(integration => integration.fromApplicationId.value),
            ...this.integrations.map(integration => integration.toApplicationId.value)
        ]
        .filter((applicationId, index, applicationIds) => {
            return applicationIds.indexOf(applicationId) === index;
        });

        // Now give me a filtered view of only the applications that have an integration to or from them,
        // or which has descendant child applications which have activate integrations.
        const activeApplications = applications.map(application => {
            const hasActiveIntegration = applicationsWithIntegrationsIds.includes(application.id.value);
            const childActiveApplications = this.getActiveApplications(application.childApplications, applicationIdFilter);
            const isInApplicationFilter = applicationIdFilter ? applicationIdFilter.find(id => id.equals(application.id)) : true;

            if ((hasActiveIntegration && isInApplicationFilter) || childActiveApplications.length > 0) {
                return new ApplicationEntity(
                    application.id,
                    application.name,
                    application.integrations,
                    childActiveApplications
                );
            }

            return null;
        })
        .filter(application => application !== null) as ApplicationEntity[];

        return activeApplications;
    }

    public get activeApplications(): ApplicationEntity[] {
        return this.getActiveApplications(this.applications);
    }

    public getActiveApplicationsForDomain(domainId: string): ApplicationEntity[] {
        const id: Id = new Id(domainId);
        const businessDomain = this.allBusinessDomains.find(businessDomain => businessDomain.id.equals(id));

        if (!businessDomain) {
            throw new DomainError(`Business domain with id ${domainId} not found`);
        }

        const integrationsInDomain = this.integrations.filter(integration => {
            return businessDomain.allRequirements.some(requirement => {
                const requirementId: Id = new Id(requirement.id);

                return integration.relatedRequirement?.equals(requirementId);
            });
        });

        const applicationIdsInDomain = [
            ...businessDomain.allIntegrations.map(integration => integration.fromApplicationId),
            ...businessDomain.allIntegrations.map(integration => integration.toApplicationId)
        ]
        .filter((applicationId, index, applicationIds) => {
            return applicationIds.indexOf(applicationId) === index;
        })
        .map(applicationId => new Id(applicationId));

        const applicationsInDomain = this.getActiveApplications(this.applications, applicationIdsInDomain);

        return applicationsInDomain;
    }

    private getAllApplications(applications: ApplicationEntity[]): ApplicationEntity[] {
        const allApplications = applications.flatMap(application => {
            return [
                application,
                ...this.getAllApplications(application.childApplications)
            ];
        });

        return allApplications;
    }

    public get allApplications(): ApplicationEntity[] {
        return this.getAllApplications(this.applications);
    }

    // private flattenApplications(applications: ApplicationEntity[]): ApplicationEntity[] {
    //     const flattenedApplications = applications.flatMap(application => {
    //         return [
    //             application,
    //             ...this.flattenApplications(application.childApplications)
    //         ];
    //     });
        
    //     return flattenedApplications;
    // }

    public getIntegrationsForApplications(applications: ApplicationEntity[]): IntegrationEntity[] {
        // const flattenedApplications = this.flattenApplications(applications);

        const integrations = this.integrations.filter(integration => {
            return this.allApplications.some(application => {
                return application.id.equals(integration.fromApplicationId) || application.id.equals(integration.toApplicationId);
            });
        });

        return integrations;
    }

    public getIntegrationsForDomain(domainId: string): IntegrationEntity[] {
        const id: Id = new Id(domainId);

        const businessDomain = this.allBusinessDomains.find(businessDomain => businessDomain.id.equals(id));

        if (!businessDomain) {
            throw new DomainError(`Business domain with id ${domainId} not found`);
        }

        const integrationsInDomain = this.integrations.filter(integration => {
            return businessDomain.allRequirements.some(requirement => {
                const requirementId: Id = new Id(requirement.id);

                return integration.relatedRequirement?.equals(requirementId);
            });
        });

        return integrationsInDomain;
    }

    public static async create(
        repository: SoftwareArchitectureRepository,
        applicationDtoToApplicationEntityMapper: ApplicationDtoToApplicationEntityMapper,
        integrationDtoToIntegrationEntityMapper: IntegrationDtoToIntegrationEntityMapper,
        requirementDtoToEntityMapper: RequirementDtoToEntityMapper,
        businessDomainDtoToEntityMapper: BusinessDomainDtoToEntityMapper
    ): Promise<SoftwareArchitectureAggregate> {
        const applications = await repository.getApplications();
        const integrations = await repository.getIntegrations();
        const requirements = await repository.getRequirements();
        const businessDomains = await repository.getBusinessDomains();

        const applicationEntities = applications.map(applicationDto => applicationDtoToApplicationEntityMapper.map({
            applicationDto: applicationDto,
            allApplicationsDto: applications,
            allIntegrationsDto: integrations
        }));

        const integrationEntities = integrations.map(integrationDtoToIntegrationEntityMapper.map);

        const requirementEntities = requirements.map(requirementDto => requirementDtoToEntityMapper.map({
            requirementDto: requirementDto,
            allBusinessDomainsDto: businessDomains,
            allIntegrationsDto: integrations
        }));

        const businessDomainEntities = businessDomains.map(businessDomainDto => businessDomainDtoToEntityMapper.map({
            businessDomainDto: businessDomainDto,
            allApplicationsDto: applications,
            allIntegrationsDto: integrations,
            allBusinessDomainsDto: businessDomains,
            allRequirementsDto: requirements
        }));

        return new SoftwareArchitectureAggregate(
            applicationEntities,
            integrationEntities,
            requirementEntities,
            businessDomainEntities
        );
    }
}
