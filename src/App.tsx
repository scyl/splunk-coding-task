import { useState } from "react";
import { CPU, ServerComposerForm, ServerConfig } from "./elements/server-composer-form";
import { ServerOptionResult } from "./elements/server-option-result";

export type ServerModelResult = {
  tower: boolean;
  rack: boolean;
  mainframe: boolean;
  highDensity: boolean;
}

function App() {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<ServerModelResult>({
    tower: true,
    rack: true,
    mainframe: true,
    highDensity: true,
  });

  function onValidSubmit(value: ServerConfig) {
    const newResult = {
      tower: true,
      rack: true,
      mainframe: true,
      highDensity: true,
    };

    if (value.gpu) {
      newResult.tower = false;
      newResult.rack = false;
      newResult.mainframe = false;
      if (value.cpu !== CPU.ARM || value.memorySize < 524288) {
        newResult.highDensity = false;
      }
    } else {
      // implied from example 3
      // must be because of rule 1?
      newResult.highDensity = false;
    }

    if (value.cpu === CPU.POWER) {
      newResult.highDensity = false;
    } else {
      newResult.mainframe = false;
    }

    if (value.memorySize < 2048) {
      newResult.highDensity = false;
      newResult.mainframe = false;
      newResult.rack = false;
      newResult.tower = false;
    } else if (value.memorySize < 131072) {
      newResult.rack = false;
    }

    setShowResult(true);
    setResult(newResult);
  }

  return (
    <div className="flex flex-col">
      <header className="text-2xl m-4">
        Server Composer
      </header>
      <ServerComposerForm onValidSubmit={onValidSubmit} />
      <hr className="my-8"/>
      <ServerOptionResult result={result} show={showResult} />
    </div>
  );
}

export default App;
