import { Readable } from 'stream';
import { IColumn, IDataSource, IDataSourceConfig, IDataSourceParams, IDataSourceType, IRow } from '../../core';
import { IAccount } from '../../db';
import { IObject } from '../../typings/common';

const csvParser = require('csv-parser');


// Removido CsvFileNotFoundError já que não estava sendo usado.

export class CsvReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CsvReadError';
  }
}

export interface ICsvDataSourceConfig extends IDataSourceConfig {
   stream?: Readable;
 
}

interface ICsvDataSourceParams extends IDataSourceParams {
  stream?: Readable;
 
}
export async function detectDelimiter(stream: Readable): Promise<string> {
  const supportedDelimiters = [',', ';'];
  let highestCount = 0;
  let detectedDelimiter = ',';

  let firstLine = '';

  return new Promise((resolve, reject) => {
    stream
      .on('data', (chunk) => {
        firstLine += chunk.toString();
        if (firstLine.includes('\n')) {
          stream.pause(); // Pause the stream after reading the first line

          for (const delimiter of supportedDelimiters) {
            const count = (firstLine.match(new RegExp(delimiter, 'g')) || []).length;

            if (count > highestCount) {
              highestCount = count;
              detectedDelimiter = delimiter;
            }
          }

          resolve(detectedDelimiter);
        }
      })
      .on('error', reject);
  });
}

export class CsvDataSourceType implements IDataSourceType {
  public key = 'csv';
  public title = 'CSV';
  public configViewName = 'csv';

  public getLocals(account: IAccount): Promise<IObject> {
    // No account to get locals from
    return Promise.resolve({});
  }

public getParams(stream: Readable): ICsvDataSourceParams {
  return {
    stream: stream, // Aqui você simplesmente retorna o stream como um parâmetro
  };
}

 public validate(stream: Readable): string {
  if (!stream) return 'CSV stream is required.';

  // Se você quiser verificar outras propriedades do stream, pode adicionar aqui

  return undefined;
}


public getConfig(params: ICsvDataSourceParams): ICsvDataSourceConfig {
  return {
    stream: params.stream,
  };
}


  public getDataSource(config: ICsvDataSourceConfig): CsvDataSource {
    return new CsvDataSource();
  }
}

export class CsvDataSource implements IDataSource {
  
  private columns: IColumn[];
  private rows: IRow[];

  constructor() {
   
  }

  public async load(stream: Readable): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const rows: any[] = [];
   
    stream.pipe(csvParser())
      .on('data', (row: IRow) => rows.push(row))
      .on('end', () => {
        this.columns = Object.keys(rows[0]).map((name, index) => ({
          index: index,
          name: name,
        }));

        this.rows = rows.map((row, index) => ({
          index: index + 1,
          key: (index + 1).toString(),
          values: Object.values(row),
        }));

        resolve();
      })
      // Added error handling for stream reading
      .on('error', (error: Error) => {
        reject(new CsvReadError(`Failed to load CSV data: ${error.message}`));
      });
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


