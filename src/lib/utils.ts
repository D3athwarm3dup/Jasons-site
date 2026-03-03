export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    deck: "Deck",
    shed: "Shed",
    pergola: "Pergola",
    carport: "Carport",
    other: "Other",
  };
  return labels[category] ?? category;
}

export function getStarRating(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}
