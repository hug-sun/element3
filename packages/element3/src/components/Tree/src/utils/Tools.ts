export class Tools {
  static reversalNodeKeyMap(nodeKeyMap: any) {
    const obj = {}
    for (const key in nodeKeyMap) {
      obj[nodeKeyMap[key]] = key
    }
    return obj
  }
}
