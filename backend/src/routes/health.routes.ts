import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Check system health status
 *     description: Returns the status of the server and current timestamp.
 *     responses:
 *       200:
 *         description: Server is up and running smoothly.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

router.get("/health", (_, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date(),
  });
});

export default router;