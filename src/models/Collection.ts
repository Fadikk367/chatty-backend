

export class Collection<T extends { id: string }> {
  private items = new Map<string, T>();

  constructor(items?: T[]) {
    if (items)
      this.addMany(items);
  }

  getItems() {
    const mapIterator = this.items.values();
    return [...mapIterator];
  }

  get(key: string) {
    return this.items.get(key);
  }

  addOne(item: T): Collection<T> {
    this.items.set(item.id, item);
    return this;
  }

  addMany(items: T[]): Collection<T> {
    items.forEach(item => this.items.set(item.id, item));
    return this;
  }

  remove(itemId: string) {
    this.items.delete(itemId);
  }
}