import { ServerModelResult } from "@/app";

export function ServerOptionResult({result, show}: {result: ServerModelResult, show: boolean}) {
  if (!show) {
    return null;
  }
  return (
    <div className="m-4">
      <div className="text-xl">Server Model Options</div>
      <ServerOptionModel name="Tower Server" show={result.tower} />
      <ServerOptionModel name="4U Rack Server" show={result.rack} />
      <ServerOptionModel name="Mainframe" show={result.mainframe} />
      <ServerOptionModel name="High Density Server" show={result.highDensity} />
    </div>
  );
}

function ServerOptionModel({name, show}: {name: string, show: boolean}) {
  if (!show) {
    return null;
  }
  return <div className="ml-4">{name}</div>;
}