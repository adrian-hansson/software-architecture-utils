import { BusinessDomainDto } from "../dto/business-domain.dto";
import { IntegrationDto } from "../dto/integration.dto";
import { RequirementDto } from "../dto/requirement.dto";
import { RequirementEntity } from "../entities/requirement.entity";
import { Id } from "../value-objects/id.value-object";
import { Name } from "../value-objects/name.value-object";
import { Mapper } from "./mapper";

export interface RequirementDtoToEntityMapperProps {
    requirementDto: RequirementDto;
    allIntegrationsDto: IntegrationDto[];
    allBusinessDomainsDto: BusinessDomainDto[];
}

export class RequirementDtoToEntityMapper implements Mapper<RequirementDtoToEntityMapperProps, RequirementEntity> {
    map(from: RequirementDtoToEntityMapperProps): RequirementEntity {
        const requirementId: Id = new Id(from.requirementDto.id);
        const requirementName: Name = new Name(from.requirementDto.name);
        const relatedBusinessDomainId: Id | undefined = from.requirementDto.relatedBusinessDomain ? new Id(from.requirementDto.relatedBusinessDomain): undefined;
        const relatedBusinessDomain: BusinessDomainDto | undefined = relatedBusinessDomainId ?
                                                                     from.allBusinessDomainsDto.find(businessDomain => (new Id(businessDomain.id)).equals(relatedBusinessDomainId)) :
                                                                     undefined;

        return new RequirementEntity(
            requirementId,
            requirementName,
            relatedBusinessDomain ?? { id: 'unknownBusinessDomain', name: 'Unknown business domain'}
        );
    }
}
