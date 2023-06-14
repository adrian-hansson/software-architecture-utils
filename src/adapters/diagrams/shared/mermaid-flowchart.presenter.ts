import { ApplicationEntity } from "../../../domain/entities/application.entity";
import { IntegrationEntity } from "../../../domain/entities/integration.entity";
import { Presenter } from "../../shared/presenter";

export class MermaidFlowchartPresenter implements Presenter<any, string> {
    private presentApplicationAsSubgraph(application: ApplicationEntity, suffix: string = ''): string {
        let content: string = '';

        content += `${suffix}subgraph ${application.id.value}["${application.name.value}"]\n`;
        content += this.presentApplicationsAsSubgraph(application.childApplications, `${suffix}  `);        
        content += `${suffix}end\n`;

        return content;
    }

    private presentApplicationsAsSubgraph(applications: ApplicationEntity[], suffix: string = ''): string {
        let content: string = '';

        applications.forEach(application => {
            content += this.presentApplicationAsSubgraph(application, suffix);
        });

        return content;
    }

    private presentIntegrationAsLink(integration: IntegrationEntity): string {
        let content: string = '';

        let message: string = '';

        if (integration.method.value) {
            message += `[${integration.method.value}] `;
        }

        if (integration.trigger.value) {
            message += `${integration.trigger.value}`;
        }

        if (integration.trigger.value && integration.action.value) {
            message += ': ';
        }

        if (integration.action.value) {
            message += `${integration.action.value}`;
        }

        if (message !== '') {
            message = `"${message}"--`;
        }

        content += `${integration.fromApplicationId.value} --${message}> ${integration.toApplicationId.value}\n`;

        return content;
    }

    private presentIntegrationsAsLinks(integrations: IntegrationEntity[]): string {
        let content: string = '';

        integrations.forEach(integration => {
            content += this.presentIntegrationAsLink(integration);
        });

        return content;
    }

    public present(props: {
        applications: ApplicationEntity[],
        integrations: IntegrationEntity[],
        direction: 'LR' | 'RL' | 'TB' | 'BT'
    }): string {
        let content: string = '';

        content += `flowchart ${props.direction}\n\n`;
        content += this.presentApplicationsAsSubgraph(props.applications);
        content += '\n';
        content += this.presentIntegrationsAsLinks(props.integrations);

        return content;
    }
}