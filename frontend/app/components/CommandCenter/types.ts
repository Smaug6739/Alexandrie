export interface ItemCommand {
  id: string;
  icon: string;
  title: string;
  description: string;
  path: string;
  section: string;
  globalIndex: number;
  shortcut?: string;
}
