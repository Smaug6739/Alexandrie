export function assignParent<T extends { parent_id?: string }>(resources: T[], parentId: string | number): T[] {
  return resources.map(resource => ({ ...resource, parent_id: String(parentId) }));
}
