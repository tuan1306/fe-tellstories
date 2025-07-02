"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { UserRecentPublish } from "@/app/types/story";

const CardList = ({
  title,
  desc,
  userId,
}: {
  title: string;
  desc: string;
  userId: string;
}) => {
  const [stories, setStories] = useState<UserRecentPublish[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`/api/stories/user/published/${userId}`);
        const json = await res.json();
        setStories(json.data.data || []);
      } catch (err) {
        console.error("Failed to fetch recent stories", err);
      }
    };

    fetchStories();
  }, [userId]);

  return (
    <div>
      <h1 className="text-lg font-medium">{title}</h1>
      <h1 className="text-sm font-semibold text-muted-foreground mb-3">
        {desc}
      </h1>
      <div className="flex flex-col gap-2">
        {stories.slice(0, 3).map((story) => (
          <Card
            key={story.id}
            className="flex-row items-center justify-between gap-4 p-4"
          >
            <div className="relative w-12 h-12 overflow-hidden rounded-sm bg-muted flex items-center justify-center">
              {story.coverImageUrl?.startsWith("http") ? (
                <Image
                  src={story.coverImageUrl}
                  alt={story.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-muted-foreground text-[10px] text-center">
                  No Cover
                </span>
              )}
            </div>

            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium truncate max-w-[170px]">
                {story.title}
              </CardTitle>
              <Badge variant="secondary">{story.ageRange}</Badge>
            </CardContent>
            <CardFooter className="p-0">100 views</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardList;
