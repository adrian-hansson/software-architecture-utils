import { ApplicationDto } from "../../domain/dto/application.dto";
import { BusinessDomainDto } from "../../domain/dto/business-domain.dto";
import { IntegrationDto } from "../../domain/dto/integration.dto";
import { RequirementDto } from "../../domain/dto/requirement.dto";
import { SoftwareArchitectureRepository } from "../../domain/repositories/software-architecture.repository";
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
        const applicationsDto: ApplicationDto[] = applicationsData.map(applicationData => ({
            id: applicationData.id,
            name: applicationData.name,
            parentId: applicationData.parentId,
        }));

        return applicationsDto;
    }

    async getIntegrations(): Promise<IntegrationDto[]> {
        const integrationsData: IntegrationData[] = await this.excelRepository.loadExcelSheet<IntegrationData>(this.DATA_PATH, this.INTEGRATIONS_SHEET);
        const integrationsDto: IntegrationDto[] = integrationsData.map(integrationData => ({
            fromApplicationId: integrationData.from,
            toApplicationId: integrationData.to,
            trigger: integrationData.trigger ?? '',
            method: integrationData.method ?? '',
            action: integrationData.action ?? '',
            relatedRequirement: integrationData.relatedRequirement ? integrationData.relatedRequirement : undefined,
        }));

        return integrationsDto;
    }

    async getRequirements(): Promise<RequirementDto[]> {
        const requirementsData: RequirementData[] = await this.excelRepository.loadExcelSheet<RequirementData>(this.DATA_PATH, this.REQUIREMENTS_SHEET);
        return requirementsData;
    }

    async getBusinessDomains(): Promise<BusinessDomainDto[]> {
        const businessDomainsData: BusinessDomainData[] = await this.excelRepository.loadExcelSheet<BusinessDomainData>(this.DATA_PATH, this.BUSINESS_DOMAINS_SHEET);
        return businessDomainsData;
    }
}
