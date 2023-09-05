import { Router } from '@awaitjs/express';
import { getSharedLocals } from '../../helper';

const router = Router();

router.getAsync('/app/trial-ended', async (request, response) => {
  response.render('app/trial-ended', {
    ...await getSharedLocals(request),
  });
});

export = router;
