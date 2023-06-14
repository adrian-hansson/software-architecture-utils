import { SoftwareArchitectureAggregate } from "../../../domain/aggregates/software-architecture.aggregate"
import { ApplicationEntity } from "../../../domain/entities/application.entity";
import { IntegrationEntity } from "../../../domain/entities/integration.entity";
import { ApplicationDtoToApplicationEntityMapper } from "../../../domain/mappers/application-dto-to-application-entity.mapper";
import { BusinessDomainDtoToEntityMapper } from "../../../domain/mappers/business-domain-dto-to-entity.mapper";
import { IntegrationDtoToIntegrationEntityMapper } from "../../../domain/mappers/integration-dto-to-integration-entity.mapper";
import { RequirementDtoToEntityMapper } from "../../../domain/mappers/requirement-dto-to-entity.mapper";
import { MermaidRepository } from "../../../infrastructure/repositories/mermaid.repository";
import { SoftwareArchitectureExcelRepository } from "../../../infrastructure/repositories/software-architecture-excel.repository"
import { MermaidFlowchartPresenter } from "../shared/mermaid-flowchart.presenter";

export class FlowchartForEachDomainArchitectureController {
    private readonly FILE_NAME = 'flowchart-domain-architecture';
    private readonly mermaidRepository: MermaidRepository;
    private readonly MermaidFlowchartPresenter: MermaidFlowchartPresenter;
    private readonly softwareArchitectureExcelRepository: SoftwareArchitectureExcelRepository;

    constructor() {
        this.mermaidRepository = new MermaidRepository();
        this.softwareArchitectureExcelRepository = new SoftwareArchitectureExcelRepository();
        this.MermaidFlowchartPresenter = new MermaidFlowchartPresenter();
    }

    public async get(): Promise<void> {
        const applicationDtoToApplicationEntityMapper: ApplicationDtoToApplicationEntityMapper = new ApplicationDtoToApplicationEntityMapper();
        const integrationDtoToIntegrationEntityMapper: IntegrationDtoToIntegrationEntityMapper = new IntegrationDtoToIntegrationEntityMapper();
        const requirementDtoToEntityMapper: RequirementDtoToEntityMapper = new RequirementDtoToEntityMapper();
        const businessDomainDtoToEntityMapper: BusinessDomainDtoToEntityMapper = new BusinessDomainDtoToEntityMapper();

        const softwareArchitecture = await SoftwareArchitectureAggregate.create(
            this.softwareArchitectureExcelRepository,
            applicationDtoToApplicationEntityMapper,
            integrationDtoToIntegrationEntityMapper,
            requirementDtoToEntityMapper,
            businessDomainDtoToEntityMapper
        );

        for (const businessDomain of softwareArchitecture.allBusinessDomains) {
            const activeApplicationsForDomain: ApplicationEntity[] = softwareArchitecture.getActiveApplicationsForDomain(businessDomain.id.value);
            const integrationsForApplications: IntegrationEntity[] = softwareArchitecture.getIntegrationsForDomain(businessDomain.id.value);

            if (integrationsForApplications.length === 0) {
                continue;
            }
    
            const mermaidContent = this.MermaidFlowchartPresenter.present({
                applications: activeApplicationsForDomain,
                integrations: integrationsForApplications,
                direction: 'LR'
            });

            const fileName: string = this.FILE_NAME + '-' + businessDomain.id.value;

            await this.mermaidRepository.saveMermaidFile(fileName, mermaidContent);
            await this.mermaidRepository.saveExistingMermaidFileAsPng(fileName);
        }
    }
}
