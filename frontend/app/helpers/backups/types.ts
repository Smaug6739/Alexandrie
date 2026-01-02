export interface Manifest {
  version: string;
  created_at: string;
  options: {
    include_documents: boolean;
    include_files: boolean;
    include_metadata: boolean;
    local_data: object | null;
  };
  statistics: {
    total_nodes: number;
    total_documents: number;
    total_files: number;
    total_size_bytes: number;
  };
}

export interface ManifestExtended extends Manifest {
  includeSettings?: boolean;
}
