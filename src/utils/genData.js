export function genRandomTree(N = 15, reverse = false) {
  return {
    nodes: [...Array(N).keys()].map(i => ({ id: i })).concat([{id: 10}, {id: 11}, {id: 12}, {id: 13}]),
      links: [...Array(N).keys()]
    .filter(id => id)
    .map(id => ({
      [reverse ? 'target' : 'source']: id,
      [reverse ? 'source' : 'target']: Math.round(Math.random() * (id-1))
    })).concat([{target: 10, source: 11}, {target: 11, source: 12}])
  };
}