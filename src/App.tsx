import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Server Composer
      </header>
      <form className="Form">
        <div>
          <label htmlFor="cpu">CPU</label>
          <select id="cpu">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
          </select>
        </div>
        <div>Memory Size</div>
        <div>GPU</div>
      </form>
    </div>
  );
}

export default App;
