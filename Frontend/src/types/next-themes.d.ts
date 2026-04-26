declare module "next-themes" {
  export type Theme = string;

  export function useTheme(): {
    theme?: Theme;
    setTheme?: (theme: Theme) => void;
    resolvedTheme?: Theme;
    systemTheme?: Theme;
    themes?: Theme[];
  };
}
