const colors = ['var(--yellow)', 'var(--green)', 'var(--blue)', 'var(--turquoise)', 'var(--pink)', 'var(--red)', 'var(--font-color)'];

export function useColorHash(str: string): string {
  // Calculer un hash unique pour la chaîne
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash % colors.length);
  return colors[index];
}
