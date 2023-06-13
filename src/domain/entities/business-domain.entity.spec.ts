// write the test
import { BusinessDomainEntity } from './business-domain.entity';
import { ApplicationEntity } from './application.entity';
import { Id } from '../value-objects/id.value-object';
import { Name } from '../value-objects/name.value-object';

describe('BusinessDomainEntity', () => {
    const id = new Id('1');
    const name = new Name('Business Domain');
    const applications = [
        new ApplicationEntity(
            new Id('1'),
            new Name('Application 1'),
            [
                { fromApplicationId: '1', toApplicationId: '2', trigger: 'trigger', action: 'action', method: 'method' },
                { fromApplicationId: '2', toApplicationId: '1', trigger: 'trigger', action: 'action', method: 'method' },
            ],
            [
                new ApplicationEntity(
                    new Id('2'),
                    new Name('Application 2'),
                    [
                        { fromApplicationId: '2', toApplicationId: '3', trigger: 'trigger', action: 'action', method: 'method' },
                    ],
                    []
                ),
            ]
        ),
        new ApplicationEntity(
            new Id('3'),
            new Name('Application 3'),
            [
                { fromApplicationId: '3', toApplicationId: '1', trigger: 'trigger', action: 'action', method: 'method' },
                { fromApplicationId: '1', toApplicationId: '3', trigger: 'trigger', action: 'action', method: 'method' },
            ],
            []
        ),
    ];
    const childBusinessDomains = [
        new BusinessDomainEntity(
            new Id('business-domain-2'),
            new Name('Business Domain 2'),
            [
                new ApplicationEntity(
                    new Id('4'),
                    new Name('Application 4'),
                    [
                        { fromApplicationId: '4', toApplicationId: '5', trigger: 'trigger', action: 'action', method: 'method' },
                    ],
                    [
                        new ApplicationEntity(
                            new Id('5'),
                            new Name('Application 5'),
                            [
                                { fromApplicationId: '5', toApplicationId: '6', trigger: 'trigger', action: 'action', method: 'method' },
                            ],
                            []
                        ),
                    ]
                ),
            ],
            [],
        ),
        new BusinessDomainEntity(
            new Id('business-domain-3'),
            new Name('Business Domain 3'),
            [
                new ApplicationEntity(
                    new Id('6'),
                    new Name('Application 6'),
                    [],
                    []
                ),
            ],
            [],
        ),
    ];

    test('allApplications should return all applications', () => {
        const entity = new BusinessDomainEntity(id, name, applications, childBusinessDomains);

        const allApplications = entity.allApplications;

        expect(allApplications).toEqual([
            ...applications,
            ...childBusinessDomains.flatMap((childDomain) => childDomain.applications),
        ]);
    });

    test('integrations should return all integrations of applications', () => {
        const entity = new BusinessDomainEntity(id, name, applications, childBusinessDomains);

        const integrations = entity.integrations;

        expect(integrations).toEqual(
            applications.flatMap((application) => application.integrations)
        );
    });

    test('allIntegrations should return all integrations of applications and child business domains', () => {
        const entity = new BusinessDomainEntity(id, name, applications, childBusinessDomains);

        const allIntegrations = entity.allIntegrations;

        expect(allIntegrations).toEqual(
            [
                ...applications.flatMap((application) => application.integrations),
                ...childBusinessDomains.flatMap((childDomain) => childDomain.allIntegrations),
            ]
        );
    });
});
