import { Router, type IRouter } from "express";
import { pokeapiService } from "../pokeapi/index.js";

const router: IRouter = Router();

const typeChart: Record<string, {
  doubleDamageTo: string[]; halfDamageTo: string[]; noDamageTo: string[];
  doubleDamageFrom: string[]; halfDamageFrom: string[]; noDamageFrom: string[];
}> = {
  Normal:   { doubleDamageTo: [], halfDamageTo: ["Rock","Steel"], noDamageTo: ["Ghost"], doubleDamageFrom: ["Fighting"], halfDamageFrom: [], noDamageFrom: ["Ghost"] },
  Fire:     { doubleDamageTo: ["Grass","Ice","Bug","Steel"], halfDamageTo: ["Fire","Water","Rock","Dragon"], noDamageTo: [], doubleDamageFrom: ["Water","Ground","Rock"], halfDamageFrom: ["Fire","Grass","Ice","Bug","Steel","Fairy"], noDamageFrom: [] },
  Water:    { doubleDamageTo: ["Fire","Ground","Rock"], halfDamageTo: ["Water","Grass","Dragon"], noDamageTo: [], doubleDamageFrom: ["Electric","Grass"], halfDamageFrom: ["Fire","Water","Ice","Steel"], noDamageFrom: [] },
  Electric: { doubleDamageTo: ["Water","Flying"], halfDamageTo: ["Electric","Grass","Dragon"], noDamageTo: ["Ground"], doubleDamageFrom: ["Ground"], halfDamageFrom: ["Electric","Flying","Steel"], noDamageFrom: [] },
  Grass:    { doubleDamageTo: ["Water","Ground","Rock"], halfDamageTo: ["Fire","Grass","Poison","Flying","Bug","Dragon","Steel"], noDamageTo: [], doubleDamageFrom: ["Fire","Ice","Poison","Flying","Bug"], halfDamageFrom: ["Water","Electric","Grass","Ground"], noDamageFrom: [] },
  Ice:      { doubleDamageTo: ["Grass","Ground","Flying","Dragon"], halfDamageTo: ["Water","Ice"], noDamageTo: [], doubleDamageFrom: ["Fire","Fighting","Rock","Steel"], halfDamageFrom: ["Ice"], noDamageFrom: [] },
  Fighting: { doubleDamageTo: ["Normal","Ice","Rock","Dark","Steel"], halfDamageTo: ["Poison","Bug","Psychic","Flying","Fairy"], noDamageTo: ["Ghost"], doubleDamageFrom: ["Flying","Psychic","Fairy"], halfDamageFrom: ["Bug","Rock","Dark"], noDamageFrom: [] },
  Poison:   { doubleDamageTo: ["Grass","Fairy"], halfDamageTo: ["Poison","Ground","Rock","Ghost"], noDamageTo: ["Steel"], doubleDamageFrom: ["Ground","Psychic"], halfDamageFrom: ["Fighting","Poison","Bug","Grass","Fairy"], noDamageFrom: [] },
  Ground:   { doubleDamageTo: ["Fire","Electric","Poison","Rock","Steel"], halfDamageTo: ["Grass","Bug"], noDamageTo: ["Flying"], doubleDamageFrom: ["Water","Grass","Ice"], halfDamageFrom: ["Poison","Rock"], noDamageFrom: ["Electric"] },
  Flying:   { doubleDamageTo: ["Grass","Fighting","Bug"], halfDamageTo: ["Electric","Rock","Steel"], noDamageTo: [], doubleDamageFrom: ["Electric","Ice","Rock"], halfDamageFrom: ["Fighting","Bug","Grass"], noDamageFrom: ["Ground"] },
  Psychic:  { doubleDamageTo: ["Fighting","Poison"], halfDamageTo: ["Psychic","Steel"], noDamageTo: ["Dark"], doubleDamageFrom: ["Bug","Ghost","Dark"], halfDamageFrom: ["Fighting","Psychic"], noDamageFrom: [] },
  Bug:      { doubleDamageTo: ["Grass","Psychic","Dark"], halfDamageTo: ["Fire","Fighting","Flying","Ghost","Steel","Fairy"], noDamageTo: [], doubleDamageFrom: ["Fire","Flying","Rock"], halfDamageFrom: ["Fighting","Ground","Grass"], noDamageFrom: [] },
  Rock:     { doubleDamageTo: ["Fire","Ice","Flying","Bug"], halfDamageTo: ["Fighting","Ground","Steel"], noDamageTo: [], doubleDamageFrom: ["Water","Grass","Fighting","Ground","Steel"], halfDamageFrom: ["Normal","Fire","Poison","Flying"], noDamageFrom: [] },
  Ghost:    { doubleDamageTo: ["Psychic","Ghost"], halfDamageTo: ["Dark"], noDamageTo: ["Normal"], doubleDamageFrom: ["Ghost","Dark"], halfDamageFrom: ["Poison","Bug"], noDamageFrom: ["Normal","Fighting"] },
  Dragon:   { doubleDamageTo: ["Dragon"], halfDamageTo: ["Steel"], noDamageTo: ["Fairy"], doubleDamageFrom: ["Ice","Dragon","Fairy"], halfDamageFrom: ["Fire","Water","Electric","Grass"], noDamageFrom: [] },
  Dark:     { doubleDamageTo: ["Psychic","Ghost"], halfDamageTo: ["Fighting","Dark","Fairy"], noDamageTo: [], doubleDamageFrom: ["Fighting","Bug","Fairy"], halfDamageFrom: ["Ghost","Dark"], noDamageFrom: ["Psychic"] },
  Steel:    { doubleDamageTo: ["Ice","Rock","Fairy"], halfDamageTo: ["Fire","Water","Electric","Steel"], noDamageTo: [], doubleDamageFrom: ["Fire","Fighting","Ground"], halfDamageFrom: ["Normal","Grass","Ice","Flying","Psychic","Bug","Rock","Dragon","Steel","Fairy"], noDamageFrom: ["Poison"] },
  Fairy:    { doubleDamageTo: ["Fighting","Dragon","Dark"], halfDamageTo: ["Fire","Poison","Steel"], noDamageTo: [], doubleDamageFrom: ["Poison","Steel"], halfDamageFrom: ["Fighting","Bug","Dark"], noDamageFrom: ["Dragon"] },
};

// GET /types
router.get("/types", (_req, res) => {
  res.json(pokeapiService.getTypes());
});

// GET /types/:name
router.get("/types/:name", (req, res) => {
  const name = Array.isArray(req.params.name) ? req.params.name[0] : req.params.name;
  const typeData = pokeapiService.getTypeWithStats(name);
  if (!typeData) { res.status(404).json({ error: "Type not found" }); return; }
  res.json({
    ...typeData,
    effectiveness: typeChart[typeData.name] ?? {
      doubleDamageTo: [], halfDamageTo: [], noDamageTo: [],
      doubleDamageFrom: [], halfDamageFrom: [], noDamageFrom: [],
    },
  });
});

export default router;
