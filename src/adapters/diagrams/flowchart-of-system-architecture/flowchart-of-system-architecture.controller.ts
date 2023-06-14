import { SoftwareArchitectureAggregate } from "../../../domain/aggregates/software-architecture.aggregate"
import { ApplicationDtoToApplicationEntityMapper } from "../../../domain/mappers/application-dto-to-application-entity.mapper";
import { BusinessDomainDtoToEntityMapper } from "../../../domain/mappers/business-domain-dto-to-entity.mapper";
import { IntegrationDtoToIntegrationEntityMapper } from "../../../domain/mappers/integration-dto-to-integration-entity.mapper";
import { RequirementDtoToEntityMapper } from "../../../domain/mappers/requirement-dto-to-entity.mapper";
import { MermaidRepository } from "../../../infrastructure/repositories/mermaid.repository";
import { SoftwareArchitectureExcelRepository } from "../../../infrastructure/repositories/software-architecture-excel.repository"
import { MermaidFlowchartPresenter } from "../shared/mermaid-flowchart.presenter";

export class FlowchartOfSystemArchitectureController {
    private readonly FILE_NAME = 'flow-all';
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

        const mermaidContent = this.MermaidFlowchartPresenter.present({
            applications: softwareArchitecture.activeApplications,
            integrations: softwareArchitecture.integrations,
            direction: 'LR'
        });

        await this.mermaidRepository.saveMermaidFile(this.FILE_NAME, mermaidContent);
        await this.mermaidRepository.saveExistingMermaidFileAsPng(this.FILE_NAME);
    }
}
