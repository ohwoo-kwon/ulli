import { db } from "~/db";
import { usersTable } from "./schema";
import { and, eq } from "drizzle-orm";

export const createUser = async ({
  id,
  name,
  password,
}: {
  id: string;
  name: string;
  password: string;
}) => {
  await db.insert(usersTable).values({
    id,
    name,
    password,
  });
};

export const checkExistingUser = async (id: string) => {
  const res = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (res.length > 0) return true;
  return false;
};

export const loginUser = async ({
  id,
  password,
}: {
  id: string;
  password: string;
}) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.id, id), eq(usersTable.password, password)));
  return user;
};
