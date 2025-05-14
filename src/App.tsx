import { ServerComposerForm, ServerConfig } from "./elements/server-composer-form";

function onValidSubmit(value: ServerConfig) {
  console.log(value);
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
