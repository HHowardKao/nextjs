"use server";

import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { BlogSchema, BlogSchemaType } from "@/schemas/BlogSchema";

export const createBlog = async (values: BlogSchemaType) => {
  const vFields = BlogSchema.safeParse(values);
  if (!vFields.success) {
    return { error: "Invalid fields!!" };
  }
  const { userId, isPublished } = vFields.data;
  const user = await getUserById(userId);
  if (!user) return { error: "User not found!" };
  if (isPublished && !user.emailVerified) {
    return { error: "Please verify your email before publishing a blog." };
  }
  await db.blog.create({
    data: { ...vFields.data },
  });
  if (isPublished) {
    return { success: "Blog published successfully!" };
  }
  return { success: "Blog saved as draft!" };
};
