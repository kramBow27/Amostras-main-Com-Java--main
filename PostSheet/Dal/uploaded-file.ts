import { IObject } from "../typings/common";
import {IConnection} from './connection';

export interface IUploadedFile {
  id: number;
  user_id: string;
  name: string;
  content_type: string;
  size: number;
  s3_key: string;
  created_at: Date;
  job_uid?: string;
}

export class UploadedFile {
  private connection: IConnection;

  constructor(connection: IConnection) {
    this.connection = connection;
  }

 public async createFile(file: IUploadedFile): Promise<IUploadedFile> {
    await this.connection.execute(
        `INSERT INTO "uploaded_files" (id, user_id, name, content_type, size, s3_key, created_at, job_uid) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, 
        [file.id, file.user_id, file.name, file.content_type, file.size, file.s3_key, file.created_at.toISOString(), file.job_uid]
    );
  
    const result = await this.connection.execute('SELECT * FROM "uploaded_files" WHERE id = $1', [file.id]);
  
    // Retorna o arquivo criado.
    return this.toUploadedFile(result[0]);
}


  public async getUploadedFilesByUserId(user_id: string): Promise<IUploadedFile[]> {
    const result = await this.connection.execute('SELECT * FROM "uploaded_files" WHERE user_id = ${user_id}', {
      user_id: user_id,
    });

    return result.map(this.toUploadedFile);
  }

  public async deleteFile(fileId: string): Promise<void> {
  await this.connection.execute('DELETE FROM "uploaded_files" WHERE id = $1', [fileId]);
}
public async getFileByS3Key(s3_key: string): Promise<IUploadedFile> {
  const result = await this.connection.execute('SELECT * FROM "uploaded_files" WHERE s3_key = $1', [s3_key]);
  
  // Se não houver um resultado correspondente, a função pode retornar nulo
  if (result.length === 0) return null;

  return this.toUploadedFile(result[0]);
}

  public async getUploadedFilesByJobUid(job_uid: string): Promise<IUploadedFile> {
    const result = await this.connection.execute('SELECT * FROM "uploaded_files" WHERE job_uid = ${job_uid}', {
      job_uid: job_uid,
    });
    return this.toUploadedFile(result[0])
  }
  public async getFileById(fileId: string): Promise<IUploadedFile> {
  const result = await this.connection.execute('SELECT * FROM "uploaded_files" WHERE id = $1', [fileId]);
  // Se não houver um resultado correspondente, a função pode retornar nulo
  if (result.length === 0) return null;
  return this.toUploadedFile(result[0]);
}



  private toUploadedFile(row: IObject): IUploadedFile {
    if (!row)
      return null;

    return {
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      content_type: row.content_type,
      size: row.size,
      s3_key: row.s3_key,
      created_at: new Date(row.created_at),
      job_uid: row.job_uid
    };
  }
}
