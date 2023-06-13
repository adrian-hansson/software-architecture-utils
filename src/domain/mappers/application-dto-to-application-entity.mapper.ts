import { ApplicationDto } from "../dto/application.dto";
import { IntegrationDto } from "../dto/integration.dto";
import { ApplicationEntity } from "../entities/application.entity";
import { Id } from "../value-objects/id.value-object";
import { Name } from "../value-objects/name.value-object";
import { Mapper } from "./mapper";

export interface ApplicationDtoToApplicationEntityMapperProps {
    applicationDto: ApplicationDto;
    allApplicationsDto: ApplicationDto[];
    allIntegrationsDto: IntegrationDto[];
}

export class ApplicationDtoToApplicationEntityMapper implements Mapper<ApplicationDtoToApplicationEntityMapperProps, ApplicationEntity> {
    map(from: ApplicationDtoToApplicationEntityMapperProps): ApplicationEntity {
        return new ApplicationEntity(
            new Id(from.applicationDto.id),
            new Name(from.applicationDto.name),
            from.allIntegrationsDto.filter(integration => integration.fromApplicationId === from.applicationDto.id),
            from.allApplicationsDto.filter(application => application.parentId === from.applicationDto.id).map(application => {
                return this.map({
                    applicationDto: application,
                    allApplicationsDto: from.allApplicationsDto,
                    allIntegrationsDto: from.allIntegrationsDto,
                });
            })
        );
    }
}
