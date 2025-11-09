"use server";

import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { BlogSchema, BlogSchemaType } from "@/schemas/BlogSchema";

export const editBlog = async (values: BlogSchemaType, blogId: string) => {
  const vFields = BlogSchema.safeParse(values);
  if (!vFields.success) {
    return { error: "Invalid form data" };
  }
  const { userId, isPublished } = vFields.data;
  const user = await getUserById(userId);
  if (!user) {
    return { error: "User not found" };
  }
  if (isPublished && !user.emailVerified) {
    return { error: "Email not verified. Cannot publish blog." };
  }

  const blog = await db.blog.findUnique({
    where: { id: blogId },
  });
  if (!blog) {
    return { error: "Blog not found" };
  }

  await db.blog.update({
    where: { id: blogId },
    data: { ...vFields.data },
  });

  if (isPublished) {
    return { success: "Blog published successfully!" };
  }
  return { success: "Blog updated successfully!" };
};
