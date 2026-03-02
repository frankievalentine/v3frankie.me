export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const WHITESPACE_RE = /\s+/;

export function readingTime(content: string): string {
  const words = content.trim().split(WHITESPACE_RE).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}
