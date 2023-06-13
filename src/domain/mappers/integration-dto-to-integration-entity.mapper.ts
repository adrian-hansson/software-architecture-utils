import { IntegrationDto } from "../dto/integration.dto";
import { IntegrationEntity } from "../entities/integration.entity";
import { Action } from "../value-objects/action.value-object";
import { Id } from "../value-objects/id.value-object";
import { Method } from "../value-objects/method.value-object";
import { Trigger } from "../value-objects/trigger.value-object";
import { Mapper } from "./mapper";

export class IntegrationDtoToIntegrationEntityMapper implements Mapper<IntegrationDto, IntegrationEntity> {
    map(from: IntegrationDto): IntegrationEntity {
        return new IntegrationEntity(
            new Id(from.fromApplicationId),
            new Id(from.toApplicationId),
            new Trigger(from.trigger),
            new Method(from.method),
            new Action(from.action),
            from.relatedRequirement ? new Id(from.relatedRequirement) : undefined
        );
    }
}
