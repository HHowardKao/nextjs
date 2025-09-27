"use server";

import { db } from "@/lib/db";
import { getPasswordResetTokenByToken } from "@/lib/passwordResetToken";
import { getUserByEmail } from "@/lib/user";
import {
  PasswordResetSchema,
  PasswordResetSchemaType,
} from "@/schemas/PasswordResetSchema";
import bcrypt from "bcryptjs";
import { get } from "http";
import { email } from "zod";
import { id } from "zod/v4/locales";

export const passwordReset = async (
  values: PasswordResetSchemaType,
  token?: string | null
) => {
  if (!token) {
    return { error: "Token does not exist!" };
  }
  const validateFields = PasswordResetSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Password" };
  }

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const isExpired = new Date(existingToken.expires) < new Date();
  if (isExpired) {
    return { error: "Token has expired" };
  }

  const user = await getUserByEmail(existingToken.email);
  if (!user) {
    return { error: "User not found" };
  }

  const { password } = validateFields.data;
  const hashPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: user.id },
    data: {
      password: hashPassword,
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password has been reset successfully!" };
};
