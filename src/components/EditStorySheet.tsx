"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addStorySchema } from "@/utils/validators/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { StoryEditDetails } from "@/app/types/story";

export function EditStorySheet({
  children,
  story,
  onSuccess,
}: {
  children: React.ReactNode;
  story?: StoryEditDetails;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [coverImageFile, setCoverImageFile] = React.useState<File | null>(null);

  const form = useForm<z.infer<typeof addStorySchema>>({
    resolver: zodResolver(addStorySchema),
    defaultValues: {
      id: story?.id || crypto.randomUUID(),
      title: story?.title || "",
      author: story?.author || "",
      description: story?.description || "",
      isDraft: story?.isDraft ?? true,
      coverImageUrl: story?.coverImageUrl || "",
      language: story?.language as "ENG" | "VIE",
      duration: story?.duration ?? 0,
      ageRange: story?.ageRange as "1-3" | "3-5" | "5-8" | "8-10" | "10+",
      readingLevel: story?.readingLevel as "Sơ cấp" | "Trung cấp" | "Nâng cao",
      storyType: story?.storyType || "",
      isAIGenerated: story?.isAIGenerated ?? false,
      backgroundMusicUrl: story?.backgroundMusicUrl || "",
      panels: story?.panels || [],
      tags: {
        tagNames: Array.isArray(story?.tags)
          ? story.tags.map((tag) => tag.name)
          : story?.tags?.tagNames || [],
      },
    },
  });

  async function onSubmit(values: z.infer<typeof addStorySchema>) {
    try {
      if (!story?.id) throw new Error("Story ID is missing");

      let coverImageUrl = story?.coverImageUrl || "";

      // Docs: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects
      if (coverImageFile) {
        const formData = new FormData();
        formData.append("file", coverImageFile);

        const uploadRes = await fetch("/api/cdn/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Upload failed");

        const uploadData = await uploadRes.json();
        coverImageUrl = uploadData.url;

        form.setValue("coverImageUrl", coverImageUrl);
      }

      //Bugged
      // const uniqueTags = Array.from(
      //   new Set(values.tags.tagNames.map((tag) => tag.trim()))
      // );
      const payload = {
        ...values,
        // tags: { tagNames: uniqueTags },
        coverImageUrl,
      };

      const res = await fetch(`/api/stories/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update story");
      }

      const data = await res.json();
      console.log("Updated story:", data);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-full">
          <div className="p-5">
            <SheetHeader className="p-0">
              <SheetTitle className="text-2xl">Edit Story Metadata</SheetTitle>
              <SheetDescription className="mb-10">
                Fill in the details below to edit the story in your system. Make
                sure everything looks right before saving.
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                  console.log("Validation failed:", errors);
                })}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="My Great Story" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Author Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="A tale about..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImageUrl"
                  render={() => (
                    <FormItem>
                      <FormLabel>Cover image URL</FormLabel>
                      <FormControl>
                        <div className="flex gap-5">
                          <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setCoverImageFile(file);
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="avatar"
                            className="inline-block cursor-pointer rounded-md border border-input bg-background px-4 py-2 text-sm text-foreground shadow-sm transition hover:bg-muted"
                          >
                            Choose File
                          </label>
                          {coverImageFile && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {coverImageFile.name} selected
                            </p>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ageRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Range</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select age range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-3">1-3</SelectItem>
                          <SelectItem value="3-5">3-5</SelectItem>
                          <SelectItem value="5-8">5-8</SelectItem>
                          <SelectItem value="8-10">8-10</SelectItem>
                          <SelectItem value="10+">10+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="readingLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reading level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reading level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sơ cấp">Sơ cấp</SelectItem>
                          <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                          <SelectItem value="Nâng cao">Nâng cao</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ENG">ENG</SelectItem>
                          <SelectItem value="VIE">VIE</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Fiction" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="backgroundMusicUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Music URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const [inputValue, setInputValue] = React.useState("");

                    const addTag = (tag: string) => {
                      const trimmed = tag.trim();
                      const currentTags = field.value?.tagNames || [];
                      if (trimmed && !currentTags.includes(trimmed)) {
                        field.onChange({ tagNames: [...currentTags, trimmed] });
                      }
                    };

                    const removeTag = (tag: string) => {
                      const currentTags = field.value?.tagNames || [];
                      field.onChange({
                        tagNames: currentTags.filter((t) => t !== tag),
                      });
                    };

                    return (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap items-center gap-2 border rounded-md p-2">
                            {(field.value?.tagNames || []).map((tag) => (
                              <span
                                key={tag}
                                className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                            <input
                              type="text"
                              className="flex-1 bg-transparent outline-none min-w-[100px]"
                              value={inputValue}
                              placeholder="Type and press Enter"
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === ",") {
                                  e.preventDefault();
                                  addTag(inputValue);
                                  setInputValue("");
                                }
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
