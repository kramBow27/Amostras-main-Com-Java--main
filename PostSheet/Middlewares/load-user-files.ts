// middlewares/loadUserFiles.ts
import express = require('express');
import { db } from '../../db';

export async function loadUserFiles(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
  try {
    console.log("Entrando no middleware loadUserFiles.");
    
    const user_id = request.currentSession.user_id;
    console.log(`User ID: ${user_id}`);

    request.userCsvs = await db.uploadedFile.getUploadedFilesByUserId(user_id);
    console.log(`Arquivos carregados para o usuário ${user_id}:`, request.userCsvs);

    next();
  } catch (error) {
    console.log("Erro no middleware loadUserFiles:", error);
    next(error);
  }
}
