import { IntegrationDto } from "../dto/integration.dto";
import { Id } from "../value-objects/id.value-object";
import { Name } from "../value-objects/name.value-object";

export class ApplicationEntity {
    constructor(
        public readonly id: Id,
        public readonly name: Name,
        public readonly integrations: IntegrationDto[],
        public readonly childApplications: ApplicationEntity[],
    ) { }
}
