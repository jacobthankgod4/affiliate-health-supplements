export function TrustSection() {
  const stats = [
    { label: "Products Curated", value: "150+" },
    { label: "Happy Customers", value: "50K+" },
    { label: "Expert Reviews", value: "100%" },
    { label: "Quality Guarantee", value: "Verified" },
  ]

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
