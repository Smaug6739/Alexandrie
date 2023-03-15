interface Header {
  label: string;
  field: string;
  searchable?: boolean;
  representedAs?: (row: Row) => string;
}
type Row = Record<string, any>;

export type { Header, Row };
