import { Router, type IRouter } from "express";
import healthRouter from "./health";
import pokemonRouter from "./pokemon";
import typesRouter from "./types";
import abilitiesRouter from "./abilities";
import movesRouter from "./moves";
import searchRouter from "./search";
import favoritesRouter from "./favorites";
import authRouter from "./auth";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(pokemonRouter);
router.use(typesRouter);
router.use(abilitiesRouter);
router.use(movesRouter);
router.use(searchRouter);
router.use(favoritesRouter);
router.use(authRouter);
router.use(statsRouter);

export default router;
