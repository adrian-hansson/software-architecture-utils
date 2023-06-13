import { TextFileRepository } from "./text-file.repository";

export class MermaidRepository {
    private readonly textFileRepository: TextFileRepository;
    constructor() {
        this.textFileRepository = new TextFileRepository();
    }

    public async saveMermaidFile(fileName: string, content: string): Promise<void> {
        return this.textFileRepository.saveFile(`${fileName}.mmd`, content);
    }

    public async saveExistingMermaidFileAsPng(fileName: string): Promise<void> {
        await this.textFileRepository.saveFile(fileName, '');
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
