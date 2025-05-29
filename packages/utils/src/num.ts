export const generateRandomPercentage = (max: number): number => {
  const random = Math.random() * max;
  return Math.round(random * 100) / 100;
};

export const generateRandomPrice = (
  price: number,
  maxPercentage: number
): { newPrice: number; direction: string; percentage: number } => {
  const direction = Math.round(Math.random()) ? "up" : "down";
  const percentage = generateRandomPercentage(maxPercentage);
  const newPrice =
    direction === "up"
      ? price * (percentage / 100 + 1)
      : price * ((100 - percentage) / 100);

  return { newPrice, direction, percentage };
};
