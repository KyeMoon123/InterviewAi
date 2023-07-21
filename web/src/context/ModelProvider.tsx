import {useState} from "react";
import {Model} from "types/graphql";


interface ModelContextProps {
  model: Model;
  setModel: (model: Model) => void;
}

export const ModelContext = React.createContext<ModelContextProps>(null);
ModelContext.displayName = 'ModelContext';

export const ModelProvider = ({children}) => {
  const [model, setModel] = useState<Model>(window.localStorage.getItem('model') ? JSON.parse(window.localStorage.getItem('model')) : null);

  const handleSetModel = (model:Model) => {
    setModel(model)
    window.localStorage.setItem('model', JSON.stringify(model))
  }

  return (
    <ModelContext.Provider
      value={{
        model:  model as Model,
        setModel: (model:Model) => {
          handleSetModel(model);
        }
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}
