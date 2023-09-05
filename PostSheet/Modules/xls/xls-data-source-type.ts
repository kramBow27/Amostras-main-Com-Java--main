import { Readable } from 'stream';
import { IColumn, IDataSource, IDataSourceConfig, IDataSourceParams, IDataSourceType, IRow } from '../../core';
import { IAccount } from '../../db';
import { IObject } from '../../typings/common';

import * as fs from 'fs';
import * as XLSX from 'xlsx';

export class XlsFileNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'XlsFileNotFoundError';
  }
}

export class XlsReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'XlsReadError';
  }
}

export interface IXlsDataSourceConfig extends IDataSourceConfig {
  filepath: string;
}

interface IXlsDataSourceParams extends IDataSourceParams {
  filepath: string;
}

export class XlsDataSourceType implements IDataSourceType {
  public key = 'xls';
  public title = 'XLS';
  public configViewName = 'xls';

  public getLocals(account: IAccount): Promise<IObject> {
    // No account to get locals from
    return Promise.resolve({});
  }

  public getParams(body: any): IXlsDataSourceParams {
    return {
      filepath: (body.filepath || '').trim(),
    };
  }

 public validate(params: IXlsDataSourceParams): string {
    if (!params.filepath || params.filepath.length === 0)
      return 'XLS file path is required.';

    if (!fs.existsSync(params.filepath))
      return 'XLS file does not exist. Please check your file path.';

    try {
      XLSX.readFile(params.filepath);
    } catch (error) {
      throw new XlsReadError(`Could not read XLS file: ${error.message}`);
    }

    return undefined;
  }

  public getConfig(params: IXlsDataSourceParams): IXlsDataSourceConfig {
    return {
      filepath: params.filepath,
    };
  }

  public getDataSource(): XlsDataSource {
    return new XlsDataSource();
  }
}

export class XlsDataSource implements IDataSource {

  private columns: IColumn[];
  private rows: IRow[];

  constructor() {
   
  }

public async load(stream: Readable): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const buffer = await this.readStreamToBuffer(stream);
      
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      const filteredData = data.filter(row => row.some(cell => cell != null && cell.toString().trim() !== ''));
     

      // Agora vamos usar a primeira linha (data[0]) como os nomes das colunas
      this.columns = data[0].map((name, index) => ({
        index: index,
        name: name.toString(), // Converta o nome da coluna para uma string
      }));
      
      const rows = filteredData.slice(1); // Removendo o header da planilha

      this.rows = rows.map((row: any[], index: number) => ({
        index: index + 1,
        key: (index + 1).toString(),
        values: row,
      }));
     

      resolve();
    } catch (error) {
      reject(new XlsReadError(`Failed to load XLS data: ${error.message}`));
    }
  });
}



  private readStreamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  public getColumns(): IColumn[] {
    return this.columns;
  }

  public getRows(): IRow[] {
    return this.rows;
  }

  public getRowCount(): number {
    return this.rows.length;
  }


  }
  

