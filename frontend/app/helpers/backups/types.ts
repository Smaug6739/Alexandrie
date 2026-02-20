export interface Manifest {
  version: string;
  created_at: string;
  options: {
    include_documents: boolean;
    include_files: boolean;
    include_metadata: boolean;
    include_settings: boolean;
  };
  statistics: {
    total_nodes: number;
    total_documents: number;
    total_files: number;
    total_size_bytes: number;
  };
}
