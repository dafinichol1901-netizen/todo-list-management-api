const Todo = require('../src/models/Todo');

describe('Todo category schema', () => {
  test('allows todos without a category', () => {
    const categoryPath = Todo.schema.path('category');

    expect(categoryPath.isRequired).toBeFalsy();
    expect(categoryPath.defaultValue).toBeNull();
  });
});
