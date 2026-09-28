import { Router, type IRouter } from "express";
import { ListAbilitiesQueryParams } from "@workspace/api-zod";
import { pokeapiService } from "../pokeapi/index.js";

const router: IRouter = Router();

// GET /abilities
router.get("/abilities", async (req, res): Promise<void> => {
  const parsed = ListAbilitiesQueryParams.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { page = 1, limit = 20 } = parsed.data;
  const data = await pokeapiService.getAbilityList(page, limit);
  res.json(data);
});

// GET /abilities/:id
router.get("/abilities/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const ability = await pokeapiService.getAbility(id);
  if (!ability) { res.status(404).json({ error: "Ability not found" }); return; }
  res.json(ability);
});

export default router;
