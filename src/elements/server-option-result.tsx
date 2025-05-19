import { ServerModelResult } from "@/app";

export function ServerOptionResult({result, hidden}: {result: ServerModelResult, hidden: boolean}) {
  return (
    <div className="m-4" hidden={hidden}>
      <div className="text-xl">Server Model Options</div>
      <ServerOptionModel name="Tower Server" hidden={!result.tower} />
      <ServerOptionModel name="4U Rack Server" hidden={!result.rack} />
      <ServerOptionModel name="Mainframe" hidden={!result.mainframe} />
      <ServerOptionModel name="High Density Server" hidden={!result.highDensity} />
      <NoServerOptions result={result} />
    </div>
  );
}

function ServerOptionModel({name, hidden}: {name: string, hidden: boolean}) {
  return <div className="ml-4" hidden={hidden}>{name}</div>;
}

function NoServerOptions({result}: {result: ServerModelResult}) {
  let hidden = true;
  if (
    !result.tower &&
    !result.rack &&
    !result.mainframe &&
    !result.highDensity
  ) {
    hidden = false
  }
  return <div className="ml-4" hidden={hidden}>No Options</div>;
}