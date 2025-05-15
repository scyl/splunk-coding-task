import { CPU, ServerComposerForm, ServerConfig } from "./elements/server-composer-form";

let showResult = false;
const result = {
  tower: true,
  rack: true,
  mainframe: true,
  highDensity: true,
};

function onValidSubmit(value: ServerConfig) {
  console.log(value);
  resetResult();
  console.log(result);

  if (value.gpu) {
    result.tower = false;
    result.rack = false;
    result.mainframe = false;
    if (value.cpu !== CPU.ARM || value.memorySize <= 524288) {
      result.highDensity = false;
    }
  }

  console.log("after gpu", JSON.stringify(result));


  if (value.cpu === CPU.POWER) {
    result.highDensity = false;
  } else {
    result.mainframe = false;
  }

  console.log("after power cpu", JSON.stringify(result));

  if (value.memorySize < 2048) {
    result.highDensity = false;
    result.mainframe = false;
    result.rack = false;
    result.tower = false;
  } else if (value.memorySize < 131072) {
    result.rack = false;
  }

  console.log(result);
}

function resetResult() {
  result.highDensity = true;
  result.mainframe = true;
  result.rack = true;
  result.tower = true;
}

function App() {
  return (
    <div className="flex flex-col">
      <header>
        Server Composer
      </header>
      <ServerComposerForm onValidSubmit={onValidSubmit}/>
      <hr className="my-8"/>
    </div>
  );
}

export default App;
