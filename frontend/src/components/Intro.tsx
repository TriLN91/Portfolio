import { createContext, useContext } from 'react'

/** True once the intro loader has finished; hero animations wait for it */
export const IntroContext = createContext(false)
export const useIntroDone = () => useContext(IntroContext)
