import { TextFileRepository } from "./text-file.repository";
// import { run } from "@mermaid-js/mermaid-cli"
// let run: any;

export class MermaidRepository {
    private readonly DATA_PATH = 'data';
    private readonly DATA_INPUT_PATH = `${this.DATA_PATH}/input`;
    private readonly DATA_OUTPUT_PATH = `${this.DATA_PATH}/output`;

    private readonly textFileRepository: TextFileRepository;

    constructor() {
        this.textFileRepository = new TextFileRepository();
    }

    public async saveMermaidFile(fileName: string, content: string): Promise<void> {
        return this.textFileRepository.saveFile(`${fileName}.mmd`, content);
    }

    public async saveExistingMermaidFileAsPng(fileName: string): Promise<void> {
        // await import("@mermaid-js/mermaid-cli").then(mermaidCli => {
        //     run = mermaidCli.run;
        // });

        // return await run(
        //     `${this.DATA_OUTPUT_PATH}/${fileName}.mmd`,
        //     `${this.DATA_OUTPUT_PATH}/${fileName}.png`,
        //     // {optional options},
        //  );
    }

    public async getAllMermaidFiles(): Promise<{ path: string, content: string }[]> {
        return this.textFileRepository
            .loadAllOutputFiles()
            .then((files: { path: string, content: string }[]) => {
                return files.filter((file: { path: string, content: string }) => {
                    return file.path.endsWith('.mmd');
                });
            });
    }
}
