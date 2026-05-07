interface Props {
  title: string;
  children: React.ReactNode;
}

export function RecommendationSection({
  title,
  children,
}: Props) {
  return (
    <section className="mt-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}