import React, {useState} from 'react';

export const value = {
    isArabic: false,
    toggleLanguage:()=>{}
};

export const Context = React.createContext(value);

const ContextProvider = (props: any) => {
    debugger
    
    const toggleLanguage= ()=>{
        debugger
        setState(prevState => {
            return { ...prevState, isArabic:!prevState.isArabic }
        })
    }

  const [state, setState] = useState({
    isArabic: false,
    toggleLanguage: toggleLanguage
  })

  return (

    <Context.Provider value={state}>

      {props.children}

    </Context.Provider>

  );

}

export { ContextProvider };