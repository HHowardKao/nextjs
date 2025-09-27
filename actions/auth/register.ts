"use server";
import bcrypt from "bcryptjs";
import { RegisterSchemaType, RegisterSchema } from "@/schemas/RegisterSchema";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/user";
import {
  generateEmailVerificationToken,
  sendEmailVerificationToken,
} from "@/lib/emailVerification";

export const signUp = async (values: RegisterSchemaType) => {
  const validateFields = RegisterSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }
  const { name, email, password } = validateFields.data;
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await getUserByEmail(email);
  if (user) {
    return { error: "User already exists!" };
  }
  await db.user.create({
    data: { name, email, password: hashPassword },
  });

  const emailVerificationToken = await generateEmailVerificationToken(email);
  const { error } = await sendEmailVerificationToken(
    emailVerificationToken.email,
    emailVerificationToken.token
  );
  if (error) {
    return {
      error: "Could not send verification email, please try again later.",
    };
  }
  return { success: "Verification email sent!!" };
};
