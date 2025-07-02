import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const recentPublish = [
  {
    id: 1,
    title: "To the moon",
    badge: "Sad shit",
    image: "/Cover/bookcover1.png",
    count: 4300,
  },
  {
    id: 2,
    title: "Among Us",
    badge: "Sussy shit",
    image: "/Cover/bookcover2.png",
    count: 3200,
  },
  {
    id: 3,
    title: "Silksong",
    badge: "Longwaited",
    image: "/Cover/bookcover3.png",
    count: 2400,
  },
];

const recentComment = [
  {
    id: 1,
    title: "CatNumber420",
    badge: "Basic",
    image: "/uia cat.png",
    count: 1400,
  },
  {
    id: 2,
    title: "CatNumber421",
    badge: "Basic",
    image: "/uia cat.png",
    count: 2100,
  },
  {
    id: 3,
    title: "CatNumber422",
    badge: "Premium",
    image: "/uia cat.png",
    count: 1300,
  },
];

const CardList = ({ title, desc }: { title: string; desc: string }) => {
  const list = title === "Recent Published" ? recentPublish : recentComment;
  return (
    <div className="">
      <h1 className="text-lg font-medium">{title}</h1>
      <h1 className="text-sm font-semibold text-muted-foreground mb-3">
        {desc}
      </h1>
      <div className="flex flex-col gap-2">
        {list.map((item) => (
          <Card
            key={item.id}
            className="flex-row items-center justify-between gap-4 p-4"
          >
            <div className="w-12 h-12 rounded-sm relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <Badge variant="secondary">{item.badge}</Badge>
            </CardContent>
            <CardFooter className="p-0">{item.count / 1000}K</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardList;
