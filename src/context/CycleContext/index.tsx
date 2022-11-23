import { differenceInSeconds } from 'date-fns'
import { createContext, ReactNode, useEffect, useReducer, useState } from 'react'
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAdFinishedAction } from '../../reducers/cycles/actions'
import { Cycle, CyclesReducer } from '../../reducers/cycles/reducer'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CycleContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  amountSecondPassed: number
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CycleContext = createContext({} as CycleContextType)

interface CycleContextProviderProps {
  children: ReactNode
}

export function CycleContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(CyclesReducer, {
    cycles: [],
    activeCycleId: null,
  }, () =>{
    const storageStateAsJson = localStorage.getItem('@ignite-Timer:cycles-state-1.0.0');
    
    if(storageStateAsJson){
      return JSON.parse(storageStateAsJson);
    }

    return {
      cycles: [],
      activeCycleId: null,
    }
  })

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  
  const [amountSecondPassed, setAmountSecondPassed] =  useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })


  useEffect(()=>{
    const stateJson = JSON.stringify(cyclesState);
    localStorage.setItem('@ignite-Timer:cycles-state-1.0.0',stateJson);
  },[cyclesState])
  
  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAdFinishedAction())
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondPassed,
        setSecondsPassed,
        interruptCurrentCycle,
        createNewCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
