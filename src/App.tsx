import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function App() {
  return (
    <div className="flex flex-col">
      <header>
        Server Composer
      </header>
      <form className="flex justify-around">
        <div>
          <label htmlFor="cpu">CPU</label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">1</SelectItem>
              <SelectItem value="dark">2</SelectItem>
              <SelectItem value="system">3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>Memory Size</div>
        <div>GPU</div>
      </form>
    </div>
  );
}

export default App;
