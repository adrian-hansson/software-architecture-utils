const fs = require("fs");

/** A repository that uses the Node fs to load and write text files. */
export class TextFileRepository {
    private readonly DATA_PATH = 'data';
    private readonly DATA_INPUT_PATH = `${this.DATA_PATH}/input`;
    private readonly DATA_OUTPUT_PATH = `${this.DATA_PATH}/output`;

    public async loadFile(fileName: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, 'utf8', (error: any, data: string) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    public async loadAllOutputFiles(): Promise<{ path: string, content: string }[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(this.DATA_OUTPUT_PATH, (error: any, files: string[]) => {
                if (error) {
                    reject(error);
                } else {
                    const promises = files.map((file: string) => {
                        return this.loadFile(`${this.DATA_OUTPUT_PATH}/${file}`).then((content: string) => {
                            return {
                                path: file,
                                content: content
                            };
                        });
                    });

                    Promise.all(promises).then((files: { path: string, content: string }[]) => {
                        resolve(files);
                    }).catch((error: any) => {
                        reject(error);
                    });
                }
            });
        });
    }

    public async saveFile(fileName: string, content: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.DATA_OUTPUT_PATH + '/' + fileName, content, (error: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}
