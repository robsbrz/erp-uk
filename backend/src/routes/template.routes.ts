import { Router } from 'express';
import { templateController } from '../controllers/templates/TemplateController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', templateController.createTemplate);
router.get('/', templateController.getTemplates);
router.get('/:id', templateController.getTemplate);
router.post('/:templateId/fields', templateController.addCustomField);
router.post('/:templateId/configure', templateController.configureTenant);

export default router;
