export class Paginator<T> {
  private data: Ref<T[]>;
  private maxPerPage: Ref<number>;
  public currentPage: Ref<number>;
  private filterCallback?: (item: T) => boolean;

  constructor(data: Ref<T[]>, maxPerPage: number = 5, currentPage: number = 1) {
    this.data = data;
    this.maxPerPage = ref(maxPerPage);
    this.currentPage = ref(currentPage);
  }

  public setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages.value) {
      this.currentPage.value = page;
    }
  }

  public hasNext(): boolean {
    return this.currentPage.value < this.totalPages.value;
  }

  public hasPrevious(): boolean {
    return this.currentPage.value > 1;
  }

  public next(): void {
    if (this.hasNext()) {
      this.currentPage.value += 1;
    }
  }

  public previous(): void {
    if (this.hasPrevious()) {
      this.currentPage.value -= 1;
    }
  }
  public filter(filterCallback: (item: T) => boolean): void {
    this.filterCallback = filterCallback;
    this.setPage(1); // Reset to the first page
  }
  public get currentPageItems() {
    return computed(() => {
      const filteredData = this.data.value.filter(this.filterCallback || (() => true));
      const start = (this.currentPage.value - 1) * this.maxPerPage.value;
      const end = start + this.maxPerPage.value;
      return filteredData.slice(start, end);
    });
  }
  public get startIndex() {
    return computed(() => (this.currentPage.value - 1) * this.maxPerPage.value + 1);
  }
  public get endIndex() {
    return computed(() => {
      const end = this.currentPage.value * this.maxPerPage.value;
      return end > this.data.value.length ? this.data.value.length : end;
    });
  }
  public get totalItems() {
    return computed(() => this.data.value.length);
  }

  public get totalPages() {
    return computed(() => Math.ceil(this.data.value.length / this.maxPerPage.value));
  }

  public setMaxPerPage(maxPerPage: number): void {
    this.maxPerPage.value = maxPerPage;
    this.setPage(1); // Reset to the first page
  }

  public addData(newData: T[]): void {
    this.data.value = this.data.value.concat(newData);
  }

  public setData(newData: T[]): void {
    this.data.value = newData;
    this.setPage(1); // Reset to the first page
  }
}
