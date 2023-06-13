const XLSX = require('xlsx');

export class ExcelRepository {
    private readonly DATA_PATH = 'data/input';

    public async loadExcelSheet<T>(fileName: string, sheetName: string): Promise<T[]> {
        const workbook = XLSX.readFile(`${this.DATA_PATH}/${fileName}`);
        const sheet = workbook.Sheets[sheetName];
        const jsonData: T[] = XLSX.utils.sheet_to_json(sheet);

        return jsonData;
    }
}
