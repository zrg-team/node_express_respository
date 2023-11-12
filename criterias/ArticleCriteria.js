import { ICriteria } from './ICriteria';
class ArticleCriteria extends ICriteria {
  constructor(query, params) {
    super(query, params);
  }
  applyPagination() {
    if (this.params.page && this.params.limit) {
      this.query.offset((this.params.page - 1) * this.params.limit);
      this.query.limit(this.params.limit);
    }
    return this;
  }
  applySorting() {
    if (this.params.sort_by) {
      this.query.orderBy(this.params.sort_by, this.params.orderBy || 'desc');
    }
    return this;
  }
  applyFiltering() {
    if (this.params.filter_by) {
      this.query.where(this.params.filter_by);
    }
    return this;
  }
}
export default ArticleCriteria;
