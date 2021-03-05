export function useStepList(stepStatusConfig) {
  const stepList = {
    data: [],
    add(item) {
      this.data.push(item)
    },
    changeStatus(active) {
      this.data.forEach((stepProxy, index) => {
        const isFinish = () => {
          return index < active.value
        }

        const isProcess = () => {
          return index === active.value
        }

        if (isFinish()) {
          stepProxy.changeStatus(stepStatusConfig.value.finish)
          return
        }
        if (isProcess()) {
          stepProxy.changeStatus(stepStatusConfig.value.process)
        }
      })
    }
  }

  return {
    stepList
  }
}
