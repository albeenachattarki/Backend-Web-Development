// The storage implementation and ID generation will change when this repository is
// replaced by Prisma; the repository contract and all service behavior will remain unchanged.
const posts = new Map([
  [1, { id: 1, title: 'First post', body: 'Repository boundaries protect change.', authorId: 7 }],
  [2, { id: 2, title: 'Second post', body: 'Services should speak in domain language.', authorId: 8 }],
]);

let nextId = 3;

function clone(post) {
  return post ? { ...post } : null;
}

function findAll() {
  return Array.from(posts.values(), clone);
}

function findById(id) {
  return clone(posts.get(Number(id)));
}

function create(fields) {
  const record = { id: nextId++, ...fields };
  posts.set(record.id, record);
  return clone(record);
}

function update(id, patch) {
  const numericId = Number(id);
  const existing = posts.get(numericId);
  if (!existing) return null;

  const updated = { ...existing, ...patch, id: existing.id };
  posts.set(numericId, updated);
  return clone(updated);
}

function remove(id) {
  return posts.delete(Number(id));
}

module.exports = { findAll, findById, create, update, remove };
