export const parseQS = () => {
  const qs = window.location.search.slice(1)
  const keyValuePairs = qs.split('&')
  const qsObj = keyValuePairs.reduce<Record<string, string>>((acc, pair) => {
    const [key, value] = pair.split('=')
    acc[key] = value
    return acc
  }, {})
  return qsObj
}
