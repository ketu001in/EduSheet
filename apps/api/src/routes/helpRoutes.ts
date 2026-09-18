import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { HELP_REGISTRY } from '@edusheets/content';
import { generateUserGuidePDF } from '../services/pdfService';
import { uploadHelpGuidePDF, getSignedURL } from '../services/storageService';

const router: Router = Router();
router.use(requireAuth);

// Static content, same for every user -- generate fresh on each request
// (the registry is small) and overwrite the one shared storage path, same
// "open a tab, GET this, navigate to the signed URL" pattern the web client
// already uses for every other PDF (see apps/web/src/lib/help.ts).
router.get('/guide/pdf', async (_req: AuthenticatedRequest, res, next) => {
  try {
    const buffer = await generateUserGuidePDF(HELP_REGISTRY);
    const path = await uploadHelpGuidePDF(buffer);
    const url = await getSignedURL(path);
    res.json({ success: true, url });
  } catch (error) {
    next(error);
  }
});

export default router;
