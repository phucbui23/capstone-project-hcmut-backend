export function exclude<articles, Key extends keyof articles>(
  _article: articles,
  Keys: Key[],
): Omit<articles, Key> {
  for (let key of Keys) {
    delete _article[key];
  }
  return _article;
}
