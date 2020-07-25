import mitt from 'mitt'
const emitter = mitt()
emitter.$on = on
emitter.$emit = emit
emitter.$off = off
export default emitter
