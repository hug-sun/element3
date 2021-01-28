import { TypeAssert } from './TypeAssert'
import { Event } from '../utils/Event'
import { UnknownObject } from '../types'

const { isArray, isObject } = TypeAssert

type GetterType = 'get/obj' | 'get/arr'
type SetterObjectType =
  | 'set/obj'
  | 'set/obj/add'
  | 'set/obj/del'
  | 'set/obj/put'
type SetterArrayType =
  | 'set/arr'
  | 'set/arr/add'
  | 'set/arr/del'
  | 'set/arr/put'
  | 'set/arr/len'
export type WatcherType = GetterType | SetterObjectType | SetterArrayType

export type Key = string | number | symbol

export type WatcherCbArgs<T> = {
  target: T
  key: Key
  value?: any
  currentNode?: T
}

export type WatchCb<T> = (args: WatcherCbArgs<T>) => void

export class Watcher<T extends UnknownObject> {
  private _toProxy = new WeakMap<T, T>()
  private _proxy: T
  private _event = new Event<WatcherType>()
  constructor(target: T) {
    this._proxy = this.reactive(target, target)
  }

  getProxy(): T {
    return this._proxy
  }

  reactive(target: T, lastTarget: T = null): T {
    if (!isObject(target)) {
      return target
    }
    if (this._toProxy.has(target)) {
      return this._toProxy.get(target)
    }

    const handler: ProxyHandler<T> = {
      get: this.createGetter(forCurrentNode()),
      set: this.createSetter(forCurrentNode()),
      deleteProperty: this.createDeleteProperty(forCurrentNode())
    }

    const proxy = new Proxy(target, handler)

    this._toProxy.set(target, proxy)

    return proxy
    function forCurrentNode() {
      return isArray(lastTarget) ? target : lastTarget
    }
  }
  createGetter(currentNode: T): (target: T, key: Key) => void {
    return (target: T, key: Key) => {
      if (isArray(target)) {
        this.trigger('get/arr', currentNode, target, key)
      }
      if (isObject(target) && !isArray(target)) {
        this.trigger('get/obj', currentNode, target, key)
      }

      const result = Reflect.get(target, key)
      return isObject(result) ? this.reactive(result, target) : result
    }
  }
  createSetter(currentNode: T): (target: T, key: Key, value: any) => boolean {
    return (target: T, key: Key, value: any) => {
      if (isArray(target)) {
        this.trigger('set/arr', currentNode, target, key, value)
      }
      if (isArray(target) && key === 'length') {
        this.trigger('set/arr/len', currentNode, target, key, value)
        return Reflect.set(target, key, value)
      }
      if (isArray(target) && Reflect.has(target, key)) {
        this.trigger('set/arr/put', currentNode, target, key, value)
        return Reflect.set(target, key, value)
      }
      if (isArray(target) && !Reflect.has(target, key)) {
        this.trigger('set/arr/add', currentNode, target, key, value)
        return Reflect.set(target, key, value)
      }
      if (isObject(target)) {
        this.trigger('set/obj', currentNode, target, key, value)
      }
      if (isObject(target) && Reflect.has(target, key)) {
        this.trigger('set/obj/put', currentNode, target, key, value)
        return Reflect.set(target, key, value)
      }
      if (isObject(target) && !Reflect.has(target, key)) {
        this.trigger('set/obj/add', currentNode, target, key, value)
        return Reflect.set(target, key, value)
      }
      return Reflect.set(target, key, value)
    }
  }
  createDeleteProperty(currentNode: T): (target: T, key: Key) => boolean {
    return (target: T, key: Key) => {
      if (isArray(target)) {
        this.trigger('set/arr/del', currentNode, target, key)
        return Reflect.deleteProperty(target, key)
      }
      if (isObject(target) && !isArray(target)) {
        this.trigger('set/obj/del', currentNode, target, key)
        return Reflect.deleteProperty(target, key)
      }
      return Reflect.deleteProperty(target, key)
    }
  }

  bindHandler(type: WatcherType, cb: WatchCb<T>): void {
    this._event.on(type, cb)
  }

  private trigger(
    type: WatcherType,
    currentNode: T,
    target: T,
    key: Key,
    value = null
  ): void {
    this._event.emit(type, {
      target,
      key,
      currentNode,
      value
    } as WatcherCbArgs<T>)
  }
}
