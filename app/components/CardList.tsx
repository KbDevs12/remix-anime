import Card from "./Card";
import CardSkeleton from "./CardSkeleton";
import { CardListProps } from "~/interfaces/interfaces";

export default function CardList({ data, loading }: CardListProps) {
  const skeletonCount = 6;

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 items-center">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <div key={index} className="w-full">
                <CardSkeleton />
              </div>
            ))
          : data?.map((anime, index) => (
              <div key={index} className="w-full">
                <Card
                  image={anime.image}
                  title={anime.title}
                  id={anime?.id}
                  href={anime.href}
                />
              </div>
            ))}
      </div>
    </div>
  );
}
