import ModelsCell from "src/components/ModelsPanel/ModelsCell";

const ModelsPanel = () => {
  return (
    <div className="flex flex-col h-screen w-80 bg-base-300 border-r border-base-100 ">
      <div className="p-2 pt-8">
         <h1 className={'flex text-lg font-semibold'}>Select a model</h1>
        {/*<input type="text" placeholder="Search" className="input w-full max-w-xs" />*/}
        <div className="divider"/>
      </div>
      <ModelsCell/>
    </div>
  )
}

export default ModelsPanel
