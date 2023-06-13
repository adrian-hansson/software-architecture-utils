import { Id } from "../value-objects/id.value-object";
import { Name } from "../value-objects/name.value-object";
import { BusinessDomainDto } from "../../domain/dto/business-domain.dto";

export class RequirementEntity {
    constructor (
        public readonly id: Id,
        public readonly name: Name,
        public readonly relatedBusinessDomain: BusinessDomainDto
    ) {}
}
