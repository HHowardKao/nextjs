"use server";

import { db } from "@/lib/db";

export const getPublishedBlogs = async ({
  page = 1,
  limit = 5,
  searchObj,
}: {
  page: number;
  limit: number;
  searchObj: { tag: string; title: string };
}) => {
  const skip = (page - 1) * limit;
  const { tag, title } = searchObj;
  try {
    const blogs = await db.blog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      where: {
        title: { contains: title, mode: "insensitive" },
        isPublished: true,
        ...(tag ? { tags: { has: tag } } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const totalBlogsCount = await db.blog.count({
      where: {
        title: { contains: title, mode: "insensitive" },
        isPublished: true,
        ...(tag ? { tags: { has: tag } } : {}),
      },
    });
    const hasMore = totalBlogsCount > page * limit;
    return { success: { blogs, hasMore } };
  } catch (error) {
    return { error: "Failed to fetch blogs." };
  }
};
