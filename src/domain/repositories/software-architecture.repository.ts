import { IntegrationDto } from "../dto/integration.dto";
import { ApplicationDto } from "../dto/application.dto";
import { BusinessDomainDto } from "../dto/business-domain.dto";
import { RequirementDto } from "../dto/requirement.dto";

export interface SoftwareArchitectureRepository {
    getApplications(): Promise<ApplicationDto[]>;
    getIntegrations(): Promise<IntegrationDto[]>;
    getRequirements(): Promise<RequirementDto[]>;
    getBusinessDomains(): Promise<BusinessDomainDto[]>;
}
