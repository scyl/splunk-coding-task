import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { ServerOptionResult } from "./server-option-result";


describe("Server composer result", () => {
  beforeEach(() => {
    cleanup();
  });
    
  test("Does not show anything when show is false", () => {
    render(<ServerOptionResult hidden={true} result={{
      highDensity: false,
      mainframe: false,
      rack: false,
      tower: false,
    }}/>);
    
    expect(screen.getByText("Server Model Options", {})).not.toBeVisible();
  });

  test("Render the header when show is true", () => {
    render(<ServerOptionResult hidden={false} result={{
      highDensity: false,
      mainframe: false,
      rack: false,
      tower: false,
    }}/>);
    
    expect(screen.getByText("Server Model Options")).toBeVisible();
  });

  test("Render the options", () => {
    render(<ServerOptionResult hidden={false} result={{
      highDensity: true,
      mainframe: true,
      rack: true,
      tower: true,
    }}/>);
    
    expect(screen.getByText("Tower Server")).toBeVisible();
    expect(screen.getByText("4U Rack Server")).toBeVisible();
    expect(screen.getByText("Mainframe")).toBeVisible();
    expect(screen.getByText("High Density Server")).toBeVisible();
    expect(screen.getByText("No Options")).not.toBeVisible();
  })

  test("Show no option if there is no valid server option", () => {
    render(<ServerOptionResult hidden={false} result={{
      highDensity: false,
      mainframe: false,
      rack: false,
      tower: false,
    }}/>);

    expect(screen.getByText("Tower Server")).not.toBeVisible();
    expect(screen.getByText("4U Rack Server")).not.toBeVisible();
    expect(screen.getByText("Mainframe")).not.toBeVisible();
    expect(screen.getByText("High Density Server")).not.toBeVisible();
    expect(screen.getByText("No Options")).toBeVisible();
  })
});
