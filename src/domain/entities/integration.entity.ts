import { Trigger } from "../value-objects/trigger.value-object";
import { Method } from "../value-objects/method.value-object";
import { Action } from "../value-objects/action.value-object";
import { Id } from "../value-objects/id.value-object";

export class IntegrationEntity {
    constructor (
        public readonly fromApplicationId: Id,
        public readonly toApplicationId: Id,
        public readonly trigger: Trigger,
        public readonly method: Method,
        public readonly action: Action,
        public readonly relatedRequirement?: Id
    ) {}
}
