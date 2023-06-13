import { ApplicationDto } from "../dto/application.dto";
import { BusinessDomainDto } from "../dto/business-domain.dto";
import { IntegrationDto } from "../dto/integration.dto";
import { RequirementDto } from "../dto/requirement.dto";
import { BusinessDomainEntity } from "../entities/business-domain.entity";
import { Id } from "../value-objects/id.value-object";
import { Name } from "../value-objects/name.value-object";
import { Mapper } from "./mapper";

export interface BusinessDomainDtoToEntityMapperProps {
    businessDomainDto: BusinessDomainDto;
    allApplicationsDto: ApplicationDto[];
    allIntegrationsDto: IntegrationDto[];
    allBusinessDomainsDto: BusinessDomainDto[];
    allRequirementsDto: RequirementDto[];
}

export class BusinessDomainDtoToEntityMapper implements Mapper<BusinessDomainDtoToEntityMapperProps, BusinessDomainEntity> {
    private getChildBusinessDomains(businessDomainId: Id, from: BusinessDomainDtoToEntityMapperProps): BusinessDomainDto[] {
        const childBusinessDomains: BusinessDomainDto[] = from.allBusinessDomainsDto
            .filter(childBusinessDomain => {
                if (!childBusinessDomain.parentId) {
                    return false;
                }

                const childBusinessDomainParentId: Id = new Id(childBusinessDomain.parentId);

                return childBusinessDomainParentId.equals(businessDomainId);
            }
        );

        return childBusinessDomains;
    }

    private getRelatedRequirements(businessDomainId: Id, from: BusinessDomainDtoToEntityMapperProps): RequirementDto[] {
        const relatedRequirements: RequirementDto[] = from.allRequirementsDto.filter(requirement => {
            if (!requirement.relatedBusinessDomain) {
                return false;
            }

            const requirementRelatedBusinessDomainId: Id = new Id(requirement.relatedBusinessDomain);

            return requirementRelatedBusinessDomainId.equals(businessDomainId);
        });

        return relatedRequirements;
    }

    private getRelatedIntegrations(relatedRequirements: RequirementDto[], from: BusinessDomainDtoToEntityMapperProps): IntegrationDto[] {
        const relatedIntegrations: IntegrationDto[] = from.allIntegrationsDto.filter(integration => {
            if (!integration.relatedRequirement) {
                return false;
            }

            const integrationRelatedRequirementId: Id = new Id(integration.relatedRequirement);

            return relatedRequirements.some(relatedRequirement => {
                const relatedRequirementId: Id = new Id(relatedRequirement.id);

                return relatedRequirementId.equals(integrationRelatedRequirementId);
            });
        });

        return relatedIntegrations;
    }

    private getRelatedApplications(relatedIntegrations: IntegrationDto[], from: BusinessDomainDtoToEntityMapperProps): ApplicationDto[] {
        const relatedApplications: ApplicationDto[] = from.allApplicationsDto.filter(application => {
            const applicationId: Id = new Id(application.id);

            return relatedIntegrations.some(relatedIntegration => {
                const relatedIntegrationFromApplicationId: Id = new Id(relatedIntegration.fromApplicationId);
                const relatedIntegrationToApplicationId: Id = new Id(relatedIntegration.toApplicationId);

                return applicationId.equals(relatedIntegrationFromApplicationId) || applicationId.equals(relatedIntegrationToApplicationId);
            });
        });

        return relatedApplications;
    }

    private getChildBusinessDomainEntities(childBusinessDomains: BusinessDomainDto[], from: BusinessDomainDtoToEntityMapperProps): BusinessDomainEntity[] {
        const childBusinessDomainEntities: BusinessDomainEntity[] = childBusinessDomains.length > 0 ? childBusinessDomains.map(childBusinessDomain => this.map({
            businessDomainDto: childBusinessDomain,
            allApplicationsDto: from.allApplicationsDto,
            allIntegrationsDto: from.allIntegrationsDto,
            allBusinessDomainsDto: from.allBusinessDomainsDto,
            allRequirementsDto: from.allRequirementsDto
        })) : [];

        return childBusinessDomainEntities;
    }

    map(from: BusinessDomainDtoToEntityMapperProps): BusinessDomainEntity {
        const businessDomainId: Id = new Id(from.businessDomainDto.id);
        const businessDomainName: Name = new Name(from.businessDomainDto.name);

        const relatedRequirements: RequirementDto[] = this.getRelatedRequirements(businessDomainId, from);
        const relatedIntegrations: IntegrationDto[] = this.getRelatedIntegrations(relatedRequirements, from);
        const relatedApplications: ApplicationDto[] = this.getRelatedApplications(relatedIntegrations, from);
        const childBusinessDomains: BusinessDomainDto[] = this.getChildBusinessDomains(businessDomainId, from);
        const childBusinessDomainEntities: BusinessDomainEntity[] = this.getChildBusinessDomainEntities(childBusinessDomains, from);

        const businessDomainEntity: BusinessDomainEntity = new BusinessDomainEntity(
            businessDomainId,
            businessDomainName,
            relatedApplications,
            relatedIntegrations,
            childBusinessDomainEntities,
            relatedRequirements
        );

        return businessDomainEntity;
    }
}
