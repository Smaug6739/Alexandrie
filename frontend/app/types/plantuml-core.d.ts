// @plantuml/core ships as a TeaVM-compiled bundle without type declarations.
// Its public surface is the two functions documented in the package README.
declare module '@plantuml/core' {
  export function render(lines: string[], targetId: string, options?: { dark: boolean }): void;
  export function renderToString(
    lines: string[],
    onSuccess: (svg: string) => void,
    onError: (message: string) => void,
    options?: { dark: boolean },
  ): void;
}
