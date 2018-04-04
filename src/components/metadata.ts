import * as T from "../code_generator/types"
import * as Immutable from "immutable"

export type KeyValue = { key:string, value: string }
export const getMetadata : (block: T.ArduinoCodeblockData) => Immutable.List<KeyValue> =
  b => b.kind == 'button'
    ? Immutable.List([{
        key: 'port',
        value: b.port
      }])
    : b.kind == 'led'
      ? Immutable.List([{
        key: 'port',
        value: b.port
      }, {
        key: 'color',
        value: b.color
      }])
      : Immutable.List()