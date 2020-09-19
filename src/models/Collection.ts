

export class Collection<T extends { id: string }> {
  private items = new Map<string, T>();

  constructor(items?: T[]) {
    if (items)
      this.addMany(items);
  }

  getItems(): T[] {
    const mapIterator = this.items.values();
    return [...mapIterator];
  }

  get(key: string): T {
    const item = this.items.get(key);
    if (!item)
      throw new Error('No such element');
    
    return item;
  }

  addOne(item: T): Collection<T> {
    this.items.set(item.id, item);
    return this;
  }

  addMany(items: T[]): Collection<T> {
    items.forEach(item => this.items.set(item.id, item));
    return this;
  }

  remove(itemId: string): T {
    const deletedItem = this.get(itemId);
    this.items.delete(itemId);;
    return deletedItem;
  }
}