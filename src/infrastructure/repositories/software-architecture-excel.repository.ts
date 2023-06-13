import { ApplicationDto } from "../../domain/dto/application.dto";
import { BusinessDomainDto } from "../../domain/dto/business-domain.dto";
import { IntegrationDto } from "../../domain/dto/integration.dto";
import { RequirementDto } from "../../domain/dto/requirement.dto";
import { SoftwareArchitectureRepository } from "../../domain/repositories/software-architecture.repository";
import { sanitizeId } from "../../shared/sanitize-id.util";
import { sanitizeText } from "../../shared/sanitize-text.util";
import { ApplicationData } from "../data/application.data";
import { BusinessDomainData } from "../data/business-domain.data";
import { IntegrationData } from "../data/integration.data";
import { RequirementData } from "../data/requirement.data";
import { ExcelRepository } from "./excel.repository";

export class SoftwareArchitectureExcelRepository implements SoftwareArchitectureRepository {
    private readonly DATA_PATH = 'data.xlsx';
    private readonly APPLICATIONS_SHEET = 'applications';
    private readonly INTEGRATIONS_SHEET = 'integrations';
    private readonly REQUIREMENTS_SHEET = 'requirements';
    private readonly BUSINESS_DOMAINS_SHEET = 'businessDomains';

    private readonly excelRepository: ExcelRepository;

    constructor() {
        this.excelRepository = new ExcelRepository();
    }

    async getApplications(): Promise<ApplicationDto[]> {
        const applicationsData: ApplicationData[] = await this.excelRepository.loadExcelSheet<ApplicationData>(this.DATA_PATH, this.APPLICATIONS_SHEET);
        const applicationsDto: ApplicationDto[] = applicationsData
            .filter(applicationData => applicationData.id)
            .map(applicationData => ({
                id: sanitizeId(applicationData.id),
                name: sanitizeText(applicationData.name),
                parentId: applicationData.parentId ? sanitizeId(applicationData.parentId) : '',
            }));

        return applicationsDto;
    }

    async getIntegrations(): Promise<IntegrationDto[]> {
        const integrationsData: IntegrationData[] = await this.excelRepository.loadExcelSheet<IntegrationData>(this.DATA_PATH, this.INTEGRATIONS_SHEET);
        const integrationsDto: IntegrationDto[] = integrationsData
            .filter(integrationData => integrationData.from && integrationData.to)
            .map(integrationData => ({
                fromApplicationId: sanitizeId(integrationData.from),
                toApplicationId: sanitizeId(integrationData.to),
                trigger: integrationData.trigger ? sanitizeText(integrationData.trigger) : '',
                method: integrationData.method ? sanitizeText(integrationData.method) : '',
                action: integrationData.action ? sanitizeText(integrationData.action) : '',
                relatedRequirement: integrationData.relatedRequirement ? sanitizeId(integrationData.relatedRequirement) : undefined,
            }));

        return integrationsDto;
    }

    async getRequirements(): Promise<RequirementDto[]> {
        const requirementsData: RequirementData[] = await this.excelRepository.loadExcelSheet<RequirementData>(this.DATA_PATH, this.REQUIREMENTS_SHEET);
        const requirementsDto: RequirementDto[] = requirementsData
            .filter(requirementData => requirementData.id)
            .map(requirementData => ({
                id: sanitizeId(requirementData.id),
                name: sanitizeText(requirementData.name),
                relatedBusinessDomain: sanitizeId(requirementData.relatedBusinessDomain),
            }));
        return requirementsDto;
    }

    async getBusinessDomains(): Promise<BusinessDomainDto[]> {
        const businessDomainsData: BusinessDomainData[] = await this.excelRepository.loadExcelSheet<BusinessDomainData>(this.DATA_PATH, this.BUSINESS_DOMAINS_SHEET);
        const businessDomainsDto: BusinessDomainDto[] = businessDomainsData
            .filter(businessDomainData => businessDomainData.id)
            .map(businessDomainData => ({
                id: sanitizeId(businessDomainData.id),
                name: sanitizeText(businessDomainData.name),
                parentId: businessDomainData.parentId ? sanitizeId(businessDomainData.parentId) : undefined,
            }));
        return businessDomainsDto;
    }
}
