// const readline = require('readline');

import { FlowchartOfSystemArchitectureController } from "./adapters/diagrams/flowchart-of-system-architecture/flowchart-of-system-architecture.controller";

// function async prompt(choices: string[]): Promise<string> {
//     return new Promise((resolve, reject) => {
//         const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout
//         });

//         rl.question(choices.join('\n'), (answer: string) => {
//             rl.close();
//             resolve(answer);
//         });
//     });
// }

const CHOICES: { id: string, name: string }[] = [
    { id: '1', name: 'Flowchart of System Architecture' },
];

function main() {
    // Assime this script is run via CLI
    // Present a series of choices, which the user can select from using arrow keys and enter. The choices should correspond to the controllers that exist in the dapters folder.
    // The user can also press 'q' to quit the program.
    // present the choices in code on the line below:
    const choices = [
        'Flowchart of System Architecture',
    ];

    // const choice: string = prompt(choices);
    const choice: string = '1';

    if (choice === 'q') {
        return;
    } else if (choice === '1') {
        const flowchartOfSystemArchitectureController = new FlowchartOfSystemArchitectureController();
        flowchartOfSystemArchitectureController.get();
    }
}

main();
