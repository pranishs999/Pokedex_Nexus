import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import { randomUUID } from "crypto";
import router from "./routes";
import { logger } from "./lib/logger";
import { pokeapiService } from "./pokeapi/index.js";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "pkmp-dev-secret-change-in-production";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(SESSION_SECRET));

// Simple in-memory session store
const sessions = new Map<string, { userId: number }>();

// Restore session from cookie or Authorization header
app.use((req: any, _res, next) => {
  const token =
    req.cookies?.["pkmp_token"] ??
    req.headers?.["authorization"]?.replace("Bearer ", "");
  if (token && sessions.has(token)) {
    req.session = sessions.get(token);
    req.sessionToken = token;
  } else {
    req.session = null;
  }
  next();
});

// Session persistence: intercept res.json to write/clear cookies after auth routes
app.use((req: any, res: any, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    if (req._newSession) {
      const token = Buffer.from(randomUUID()).toString("base64url");
      sessions.set(token, req._newSession);
      res.cookie("pkmp_token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      // Also include the token in the response body for header-based auth
      if (body && typeof body === "object") {
        body = { ...body, token };
      }
    }
    if (req._clearSession && req.sessionToken) {
      sessions.delete(req.sessionToken);
      res.clearCookie("pkmp_token");
    }
    return originalJson(body);
  };
  next();
});

app.use("/api", router);

// Start background loading of all Pokémon from PokéAPI
pokeapiService.init().catch(err => logger.error({ err }, "PokeAPI init failed"));

export default app;
