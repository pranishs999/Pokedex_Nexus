import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, favoritesTable } from "@workspace/db";
import { RegisterBody, LoginBody, UpdateProfileBody } from "@workspace/api-zod";
import bcrypt from "bcrypt";
import { sql } from "drizzle-orm";

const router: IRouter = Router();
const BCRYPT_ROUNDS = 12;

async function getUserWithFavoriteCount(userId: number) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) return null;
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(favoritesTable)
    .where(eq(favoritesTable.userId, userId));
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    favoriteCount: Number(row.count),
    createdAt: user.createdAt.toISOString(),
  };
}

// POST /auth/register
router.post("/auth/register", async (req: any, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, email, password } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const [user] = await db.insert(usersTable).values({ username, email, passwordHash }).returning();

  req._newSession = { userId: user.id };

  const profile = await getUserWithFavoriteCount(user.id);
  res.status(201).json({ user: profile });
});

// POST /auth/login
router.post("/auth/login", async (req: any, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  const passwordMatch = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !passwordMatch) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req._newSession = { userId: user.id };

  const profile = await getUserWithFavoriteCount(user.id);
  res.json({ user: profile });
});

// POST /auth/logout
router.post("/auth/logout", async (req: any, res): Promise<void> => {
  req._clearSession = true;
  res.json({ message: "Logged out successfully" });
});

// GET /auth/me
router.get("/auth/me", async (req: any, res): Promise<void> => {
  const userId = req.session?.userId as number | undefined;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const profile = await getUserWithFavoriteCount(userId);
  if (!profile) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json(profile);
});

// PATCH /auth/me
router.patch("/auth/me", async (req: any, res): Promise<void> => {
  const userId = req.session?.userId as number | undefined;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Partial<{ username: string; email: string; avatarUrl: string }> = {};
  if (parsed.data.username) updates.username = parsed.data.username;
  if (parsed.data.email) updates.email = parsed.data.email;
  if (parsed.data.avatarUrl) updates.avatarUrl = parsed.data.avatarUrl;

  await db.update(usersTable).set(updates).where(eq(usersTable.id, userId));
  const profile = await getUserWithFavoriteCount(userId);
  res.json(profile);
});

export default router;
