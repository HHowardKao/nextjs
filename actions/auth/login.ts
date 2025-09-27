"use server";

import { signIn } from "@/auth";
import { generateEmailVerificationToken } from "@/lib/emailVerification";
import { getUserByEmail } from "@/lib/user";
import { LOGIN_REDIRECT } from "@/routes";
import { LoginSchemaType, LoginSchema } from "@/schemas/LoginSchema";
import { AuthError } from "next-auth";
import { sendEmailVerificationToken } from "@/lib/emailVerification";
export const login = async (values: LoginSchemaType) => {
  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }
  const { email, password } = validateFields.data;

  const user = await getUserByEmail(email);
  if (!user || !email || !password || !user.password) {
    return { error: "Invalid credentials" };
  }
  if (!user.emailVerified) {
    const emailVerificationToken = await generateEmailVerificationToken(
      user.email
    );
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
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong, please try again later." };
      }
    }
  }
};
