import { Document, Packer, Paragraph, TextRun } from "docx";
const fs = require("fs");

export class WordRepository {
    private readonly DATA_PATH = 'data/input';

    public async createWordFile(fileName: string, content: string): Promise<void> {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun("Hello World"),
                                new TextRun({
                                    text: "Foo Bar",
                                    bold: true,
                                }),
                                new TextRun({
                                    text: "\tGithub is the best",
                                    bold: true,
                                }),
                            ],
                        }),
                    ],
                },
            ],
        });

        Packer.toBuffer(doc).then((buffer) => {
            fs.writeFileSync(`${this.DATA_PATH}/${fileName}.docx`, buffer);
        });
    }
}
