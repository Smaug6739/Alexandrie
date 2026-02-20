import type { FileEntry } from '@zip.js/zip.js';
import type { Manifest } from './types';
import type { DB_Node } from '~/stores';

export async function readZipFile(file: File): Promise<FileEntry[]> {
  const { ZipReader, BlobReader } = await import('@zip.js/zip.js');
  const entries: FileEntry[] = [];
  const zipReader = new ZipReader(new BlobReader(file));
  const zipEntries = await zipReader.getEntries();
  for (const entry of zipEntries) {
    if (!entry.directory && entry.filename.endsWith('.json')) {
      entries.push(entry);
    }
  }
  await zipReader.close();
  return entries;
}

async function _readJSONFile(fileEntry: FileEntry): Promise<object> {
  const { BlobWriter } = await import('@zip.js/zip.js');
  const blob = await fileEntry.getData!(new BlobWriter('application/json'));
  const text = await blob.text();
  const data = JSON.parse(text);
  return data;
}

export async function readBackupManifest(fileEntry: FileEntry): Promise<Manifest> {
  const data = await _readJSONFile(fileEntry);

  // Validate manifest structure
  if (typeof data !== 'object' || !('version' in data) || !('created_at' in data) || !('options' in data) || !('statistics' in data)) {
    throw new Error('Invalid manifest structure');
  }

  return data as Manifest;
}

export async function readBackupDocuments(fileEntry: FileEntry): Promise<DB_Node[]> {
  const data = (await _readJSONFile(fileEntry)) as DB_Node[];
  if (!Array.isArray(data)) {
    throw new Error('Invalid documents structure');
  }
  // Check each item
  for (const item of data) {
    if (!('name' in item) || typeof item.name !== 'string') {
      throw new Error('Invalid document item structure');
    }
  }
  return data;
}

export async function readLocalData(fileEntry: FileEntry): Promise<object> {
  const data = await _readJSONFile(fileEntry);
  return data;
}

export async function handleBackupFile(file: File): Promise<{
  manifest: Manifest;
  documents: DB_Node[] | null;
  localData: object | null;
}> {
  const entries = await readZipFile(file);
  let manifest: Manifest | null = null;
  let documents: DB_Node[] | null = null;
  let localData: object | null = null;
  for (const entry of entries) {
    if (entry.filename === 'manifest.json') {
      manifest = await readBackupManifest(entry);
    } else if (entry.filename === 'documents.json') {
      documents = await readBackupDocuments(entry);
    } else if (entry.filename === 'user_settings.json') {
      localData = await readLocalData(entry);
    }
  }

  if (!manifest) {
    throw new Error('Manifest file is missing in the backup');
  }

  return {
    manifest,
    documents,
    localData,
  };
}
