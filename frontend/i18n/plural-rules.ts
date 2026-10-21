// Russian messages use three forms: one (1, 21), few (2–4, 22–24), and many (0, 5–20).
export const russianPluralRule = (choice: number) => {
  const count = Math.abs(choice);
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) return 0;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) return 1;
  return 2;
};
