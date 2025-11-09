"use client";

import { BlogSchema, BlogSchemaType } from "@/schemas/BlogSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "../common/FormField";
import AddCover from "./AddCover";
import { useEffect, useState, useTransition } from "react";
import CoverImage from "./CoverImage";
import { tags } from "@/lib/tags";
import BlockNoteEditor from "./editor/BlockNoteEditor";
import Button from "../common/Button";
import Alert from "../common/Alert";
import { createBlog } from "@/actions/blogs/create-blog";
import { Blog } from "@prisma/client";
import { editBlog } from "@/actions/blogs/edit-blog";

const CreateBlogForm = ({ blog }: { blog?: Blog }) => {
  const session = useSession();
  const userId = session.data?.user.userId;
  const [uploadedCover, setupLoadedCover] = useState<string>();
  const [content, setContent] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPublishing, startPublishing] = useTransition();
  const [isSavingDraft, startSavingDraft] = useTransition();
  console.log(uploadedCover);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BlogSchemaType>({
    resolver: zodResolver(BlogSchema),
    defaultValues: blog
      ? {
          userId: blog.userId,
          title: blog.title,
          content: blog.content,
          coverImage: blog.coverImage || undefined,
          tags: blog.tags,
          isPublished: blog.isPublished,
        }
      : {
          userId,
          isPublished: false,
        },
  });

  useEffect(() => {
    if (uploadedCover) {
      setValue("coverImage", uploadedCover, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [uploadedCover]);

  useEffect(() => {
    if (typeof content === "string") {
      setValue("content", content, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [content]);

  useEffect(() => {
    if (blog?.coverImage) {
      setupLoadedCover(blog.coverImage);
    }
  }, [blog?.coverImage]);

  const onChange = (content: string) => {
    setContent(content);
  };

  const onPublish: SubmitHandler<BlogSchemaType> = (data) => {
    console.log("data", data);
    setSuccess("");
    setError("");
    if (data.tags.length > 4) {
      return setError("Select up to 4 tags only!");
    }
    startPublishing(() => {
      if (blog) {
        editBlog({ ...data, isPublished: true }, blog.id).then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSuccess(data.success);
          }
        });
      } else {
        createBlog({ ...data, isPublished: true }).then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSuccess(data.success);
          }
        });
      }
    });
  };
  const onSaveDraft: SubmitHandler<BlogSchemaType> = (data) => {
    setSuccess("");
    setError("");

    startSavingDraft(() => {
      if (blog) {
        editBlog({ ...data, isPublished: false }, blog.id).then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSuccess(data.success);
          }
        });
      } else {
        createBlog({ ...data, isPublished: false }).then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSuccess(data.success);
          }
        });
      }
    });
  };
  console.log("errors", errors);
  return (
    <form
      onSubmit={handleSubmit(onPublish)}
      className="flex flex-col justify-between max-w-[1200px] m-auto min-h-[85vh]"
    >
      <div>
        {!!uploadedCover && (
          <CoverImage
            url={uploadedCover}
            isEditor={true}
            setUploadedCover={setupLoadedCover}
          />
        )}
        {!uploadedCover && <AddCover setUploadedCover={setupLoadedCover} />}
        <FormField
          id="title"
          register={register}
          errors={errors}
          placeholder="Blog Title"
          disabled={false}
          inputClassNames="border-none text-5xl font-bold px-0 bg-transparent"
        />
        <fieldset className="flex flex-col border-y mb-4 py-2">
          <legend className="mb-2 pr-2">Select 4 Tags</legend>
          <div className="flex gap-4 flex-wrap w-full">
            {tags.map((tag) => {
              if (tag === "All") return null;
              return (
                <label key={tag} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={tag}
                    {...register("tags")}
                    disabled={false}
                  />
                  <span>{tag}</span>
                </label>
              );
            })}
          </div>
          {errors.tags && errors.tags.message && (
            <span className="text-sm text-rose-400">
              Select at least one tag,max of 4!!
            </span>
          )}
        </fieldset>
        <BlockNoteEditor
          onChange={onChange}
          initialContent={blog?.content ? blog.content : ""}
        />
        {errors.content && errors.content.message && (
          <span className="text-sm text-rose-400">
            {errors.content.message}
          </span>
        )}
      </div>
      <div className="border-t pt-2">
        {errors.userId && errors.userId.message && (
          <span className="text-sm text-rose-400">Missing a userId</span>
        )}
        {success && <Alert message={success} success />}
        {error && <Alert message={error} error />}
        <div className="flex justify-between items-center gap-6">
          <div>
            <Button type="button" label="Delete" />
          </div>
          <div className="flex  gap-4">
            <Button
              type="submit"
              label={isPublishing ? "Publishing..." : "Publish"}
              className="bg-blue-700"
            />
            <Button
              type="button"
              label={isSavingDraft ? "Saving..." : "Save as Draft"}
              onClick={handleSubmit(onSaveDraft)}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateBlogForm;
