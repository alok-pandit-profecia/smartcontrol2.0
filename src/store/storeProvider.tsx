import { useContext, createContext } from "react"
import { RootStoreModel } from "./rootStore"

const StoreContext = createContext<RootStoreModel>({} as RootStoreModel)

export const useStore = () => useContext(StoreContext)
export const StoreProvider = StoreContext.Provider