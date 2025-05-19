import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./app";

describe("Server Composer App", () => {
  beforeEach(() => {
    cleanup();
  })

  test("Render server composer form", () => {
    render(<App />);

    expect(screen.getByLabelText("CPU")).toBeDefined();
    expect(screen.getByLabelText("Memory Size")).toBeDefined();
    expect(screen.getByLabelText("GPU Accelerator Card")).toBeDefined();
  });

  test("Render server option results", async () => {
    render(<App />);

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const cpuOption = await screen.findByRole("option", { name: /^x86$/i });
    act(() => {
      cpuOption.click();

      const memorySizeInput = screen.getByLabelText("Memory Size");
      fireEvent.change(memorySizeInput, {target: {value: "4,096"}});
      screen.getByText("Submit").click();
    });

    expect(await screen.findByText("Server Model Options")).toBeVisible();
  });

  test("No options because GPU required but invalid CPU selected", async () => {
    render(<App />);

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const cpuOption = await screen.findByRole("option", { name: /^x86$/i });
    act(() => {
      cpuOption.click();

      const memorySizeInput = screen.getByLabelText("Memory Size");
      fireEvent.change(memorySizeInput, {target: {value: "524,288"}});
      screen.getByLabelText("GPU Accelerator Card").click();
      screen.getByText("Submit").click();
    });

    await waitFor(async () => {
      expect(await screen.findByText("Tower Server")).not.toBeVisible();
      expect(await screen.findByText("4U Rack Server")).not.toBeVisible();
      expect(await screen.findByText("Mainframe")).not.toBeVisible();
      expect(await screen.findByText("High Density Server")).not.toBeVisible();
      expect(await screen.findByText("No Options")).toBeVisible();
    });
  });

  test("No options because GPU required but low mempory selected", async () => {
    render(<App />);

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const cpuOption = await screen.findByRole("option", { name: /^arm$/i });
    act(() => {
      cpuOption.click();

      const memorySizeInput = screen.getByLabelText("Memory Size");
      fireEvent.change(memorySizeInput, {target: {value: "4,096"}});
      screen.getByLabelText("GPU Accelerator Card").click();
      screen.getByText("Submit").click();
    });

    await waitFor(async () => {
      expect(await screen.findByText("Tower Server")).not.toBeVisible();
      expect(await screen.findByText("4U Rack Server")).not.toBeVisible();
      expect(await screen.findByText("Mainframe")).not.toBeVisible();
      expect(await screen.findByText("High Density Server")).not.toBeVisible();
      expect(await screen.findByText("No Options")).toBeVisible();
    });
  });

  test("High density options because GPU selected", async () => {
    render(<App />);

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const cpuOption = await screen.findByRole("option", { name: /^arm$/i });
    act(() => {
      cpuOption.click();

      const memorySizeInput = screen.getByLabelText("Memory Size");
      fireEvent.change(memorySizeInput, {target: {value: "524,288"}});
      screen.getByLabelText("GPU Accelerator Card").click();
      screen.getByText("Submit").click();
    });

    await waitFor(async () => {
      expect(await screen.findByText("Tower Server")).not.toBeVisible();
      expect(await screen.findByText("4U Rack Server")).not.toBeVisible();
      expect(await screen.findByText("Mainframe")).not.toBeVisible();
      expect(await screen.findByText("High Density Server")).toBeVisible();
      expect(await screen.findByText("No Options")).not.toBeVisible();
    });
  });

  test("Mainframe is an option when power CPU is selected", async () => {
    render(<App />);

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const cpuOption = await screen.findByRole("option", { name: /^power$/i });
    act(() => {
      cpuOption.click();

      const memorySizeInput = screen.getByLabelText("Memory Size");
      fireEvent.change(memorySizeInput, {target: {value: "524,288"}});
      screen.getByText("Submit").click();
    });

    await waitFor(async () => {
      expect(screen.getByText("Tower Server")).toBeVisible();
      expect(screen.getByText("4U Rack Server")).toBeVisible();
      expect(screen.getByText("Mainframe")).toBeVisible();
      expect(screen.getByText("High Density Server")).not.toBeVisible();
      expect(screen.getByText("No Options")).not.toBeVisible();
    });
  });

  test("Mainframe not an option when arm CPU is selected", async () => {
    render(<App />);

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const powerOption = await screen.findByRole("option", { name: /^power$/i });
    act(() => {
      powerOption.click();
      const memorySizeInput = screen.getByLabelText("Memory Size");
      fireEvent.change(memorySizeInput, {target: {value: "524,288"}});
      screen.getByText("Submit").click();
    });

    await waitFor(async () => {
      expect(screen.getByText("Mainframe")).toBeVisible();
    })

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const armOption = await screen.findByRole("option", { name: /^arm$/i });
    await act(async () => {
      armOption.click();
      await new Promise((resolve) => setTimeout(resolve, 10))
      screen.getByText("Submit").click();
    });

    await waitFor(async () => {
      expect(screen.getByText("Tower Server")).toBeVisible();
      expect(screen.getByText("4U Rack Server")).toBeVisible();
      expect(screen.getByText("Mainframe")).not.toBeVisible();
      expect(screen.getByText("High Density Server")).not.toBeVisible();
      expect(screen.getByText("No Options")).not.toBeVisible();
    });
  });

  test("Mainframe not an option when x86 CPU is selected", async () => {
    render(<App />);

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const powerOption = await screen.findByRole("option", { name: /^power$/i });
    act(() => {
      powerOption.click();
      const memorySizeInput = screen.getByLabelText("Memory Size");
      fireEvent.change(memorySizeInput, {target: {value: "524,288"}});
      screen.getByText("Submit").click();
    });

    await waitFor(async () => {
      expect(screen.getByText("Mainframe")).toBeVisible();
    })

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const armOption = await screen.findByRole("option", { name: /^x86$/i });
    await act(async () => {
      armOption.click();
      await new Promise((resolve) => setTimeout(resolve, 10))
      screen.getByText("Submit").click();
    });

    await waitFor(async () => {
      expect(screen.getByText("Tower Server")).toBeVisible();
      expect(screen.getByText("4U Rack Server")).toBeVisible();
      expect(screen.getByText("Mainframe")).not.toBeVisible();
      expect(screen.getByText("High Density Server")).not.toBeVisible();
      expect(screen.getByText("No Options")).not.toBeVisible();
    });
  });

  test("No option when memory is below 2048", async () => {
    render(<App />);

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const cpuOption = await screen.findByRole("option", { name: /^power$/i });
    act(() => {
      cpuOption.click();

      const memorySizeInput = screen.getByLabelText("Memory Size");
      fireEvent.change(memorySizeInput, {target: {value: "1,024"}});
      screen.getByText("Submit").click();
    });

    await waitFor(async () => {
      expect(screen.getByText("Tower Server")).not.toBeVisible();
      expect(screen.getByText("4U Rack Server")).not.toBeVisible();
      expect(screen.getByText("Mainframe")).not.toBeVisible();
      expect(screen.getByText("High Density Server")).not.toBeVisible();
      expect(screen.getByText("No Options")).toBeVisible();
    })
  });

  test("4U Rack is not an option when memory is below 131072", async () => {
    render(<App />);

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const cpuOption = await screen.findByRole("option", { name: /^power$/i });
    act(() => {
      cpuOption.click();

      const memorySizeInput = screen.getByLabelText("Memory Size");
      fireEvent.change(memorySizeInput, {target: {value: "65,536"}});
      screen.getByText("Submit").click();
    });

    await waitFor(async () => {
      expect(screen.getByText("Tower Server")).toBeVisible();
      expect(screen.getByText("4U Rack Server")).not.toBeVisible();
      expect(screen.getByText("Mainframe")).toBeVisible();
      expect(screen.getByText("High Density Server")).not.toBeVisible();
      expect(screen.getByText("No Options")).not.toBeVisible();
    })
  });
});