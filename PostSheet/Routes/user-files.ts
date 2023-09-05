import { Router } from '@awaitjs/express';
import { getSharedLocals } from '../../helper';
import { db } from '../../../db';




const router = Router();


router.getAsync('/user-files',  async (request, response) => {
  
    
    const user_id = request.currentSession.user_id;
    const uploaded_files = await db.uploadedFile.getUploadedFilesByUserId(user_id);
   
    response.render('app/user-files', {
        ...await getSharedLocals(request),
    uploaded_files: uploaded_files,})
});

export = router;