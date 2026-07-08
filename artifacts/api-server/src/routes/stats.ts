import { Router, type IRouter } from "express";
import { pokeapiService } from "../pokeapi/index.js";

const router: IRouter = Router();

// GET /stats/overview
router.get("/stats/overview", async (_req, res): Promise<void> => {
  res.json(pokeapiService.getStats());
});

// GET /stats/by-generation
router.get("/stats/by-generation", async (_req, res): Promise<void> => {
  res.json(pokeapiService.getStatsByGeneration());
});

// GET /stats/by-type
router.get("/stats/by-type", async (_req, res): Promise<void> => {
  res.json(pokeapiService.getStatsByType());
});

export default router;
