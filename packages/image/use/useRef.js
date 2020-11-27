import { ref } from 'vue'

export default function useRef(initValue) {
  const data = ref(initValue)
  const updateData = (value) => {
    data.value = value
  }

  return [data, updateData]
}
