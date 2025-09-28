type CollectionFunction<K, V> = (value: V, key: K, collection: Collection<K, V>) => boolean;

export class Collection<K, V> extends Map<K, V> {
  public static readonly default: typeof Collection = Collection;

  public hasAllKeys(keys: K[]): boolean {
    return keys.every(k => this.has(k));
  }
  public hasAnyKey(keys: K[]): boolean {
    return keys.some(k => this.has(k));
  }

  public isUnique(key: K): boolean {
    const valOne = this.get(key);
    if (!valOne) throw new TypeError('Cannot find value for key: ' + key);
    // for (const val of this.filter()) {
    // 	if (val === valOne) return false;
    // }

    if (this.filter((v: V) => v === valOne).size <= 1) return true;
    return false;
  }
  public nextKey(key: K): K | undefined {
    const keys = [...this.keys()];
    const index = keys.indexOf(key);
    if (index === -1 || index === keys.length - 1) return undefined;
    return keys[index + 1];
  }
  public next(key: K): V | undefined {
    const nextKey = this.nextKey(key);
    if (!nextKey) return undefined;
    return this.get(nextKey);
  }
  public previousKey(key: K): K | undefined {
    const keys = [...this.keys()];
    const index = keys.indexOf(key);
    if (index <= 0) return undefined;
    return keys[index - 1];
  }
  public previous(key: K): V | undefined {
    const previousKey = this.previousKey(key);
    if (!previousKey) return undefined;
    return this.get(previousKey);
  }
  public firstKey(): K | null {
    const firstKey = this.keys().next().value;
    if (firstKey) return firstKey;
    return null;
  }

  public first(): V | undefined {
    if (this.values().next().value) return this.values().next().value;
    return undefined;
  }

  public lastKey(): K | undefined {
    const arr = [...this.keys()];
    if (arr[arr.length - 1]) return arr[arr.length - 1];
    return undefined;
  }
  public last(): V | undefined {
    const arr = [...this.values()];
    if (arr[arr.length - 1]) return arr[arr.length - 1];
    return undefined;
  }

  public find(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): V | undefined {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return val;
    }
    return undefined;
  }

  public map<S = unknown>(fn: (value: V, key: K, collection: this) => S, thisArg?: unknown): Array<S> {
    const newArray = [];
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      newArray.push(fn(val, key, this));
    }
    return newArray;
  }

  filter(f: CollectionFunction<K, V>): Collection<K, V> {
    const newCollection = new Collection<K, V>();
    for (const [k, v] of this) {
      if (f(v, k, this)) newCollection.set(k, v);
    }
    return newCollection;
  }

  public keysList(): K[] | null {
    const list: K[] = [];
    for (const k of this.keys()) {
      list.push(k);
    }
    if (list) return list;
    return null;
  }

  public valuesList(): V[] | null {
    const list: V[] = [];
    for (const v of this.values()) {
      list.push(v);
    }
    if (list) return list;
    return null;
  }

  public merge(...maps: Array<Collection<K, V> | Map<K, V>>): Collection<K, V> {
    for (const map of maps) {
      for (const [k, v] of map) {
        this.set(k, v);
      }
    }
    return this;
  }

  public toArray(): Array<V> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that: this = this;
    const newArray = [];
    for (const [_, v] of that) {
      newArray.push(v);
    }
    return newArray;
  }
  public toJSON() {
    const obj = Object.fromEntries(this);
    return obj;
  }

  public each(fn: (value: V, key: K, collection: this) => void, thisArg?: unknown): this {
    this.forEach(fn as (value: V, key: K, map: Map<K, V>) => void, thisArg);
    return this;
  }
}

export default Collection;
