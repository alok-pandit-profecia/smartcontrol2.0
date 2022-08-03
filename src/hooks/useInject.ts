import { useStore } from "./../store/storeProvider";
import { RootStoreModel } from "./../store/rootStore";

export type MapStore<T> = (store: RootStoreModel) => T

const useInject = <T>(mapStore: MapStore<T>) => {
  const store = useStore()
  return mapStore(store)
}

export default useInject