import { Router, Request, Response } from 'express';

const router = Router();

// Docker health check route
router.get('/', (req: Request, res: Response) => {
    res.status(200).send("OK")
})

export default router;