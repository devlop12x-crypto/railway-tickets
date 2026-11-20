const rules = new Intl.PluralRules('ru-RU');

/** Форма слова по числу: plural(3, ['место', 'места', 'мест']) → «места» */
export function plural(count: number, [one, few, many]: readonly [string, string, string]) {
  const rule = rules.select(count);
  return rule === 'one' ? one : rule === 'few' ? few : many;
}
