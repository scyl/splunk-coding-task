import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";
import { isValidMemorySize, ServerComposerForm } from "./server-composer-form";

test.each([
  { name: "number below 1024", value: 2, expectedResult: false },
  { name: "negative number", value: -2, expectedResult: false },
  { name: "not a power of 2", value: 2047, expectedResult: false },
  { name: "power of 2", value: 2048, expectedResult: true },
])("Test isValidMemorySize $name", ({value, expectedResult}) => {
  expect(isValidMemorySize(value)).toBe(expectedResult);
});


describe("Server composer form", () => {
  beforeEach(() => {
    cleanup();
  });

  test("Have field for CPU, Memory size and GPU", () => {
    render(<ServerComposerForm onValidSubmit={() => {}}/>);
    
    expect(screen.getByLabelText("CPU")).toBeDefined();
    expect(screen.getByLabelText("Memory Size")).toBeDefined();
    expect(screen.getByLabelText("GPU Accelerator Card")).toBeDefined();
  });

  test("CPU dropdown have expected options", () => {
    render(<ServerComposerForm onValidSubmit={() => {}}/>);
    act(() => {
      screen.getByLabelText("CPU").click();
    });

    expect(screen.getByText("X86", {selector: "span"})).toBeVisible();
    expect(screen.getByText("Power", {selector: "span"})).toBeVisible();
    expect(screen.getByText("ARM", {selector: "span"})).toBeVisible();
  });

  test("Select CPU option", async () => {
    render(<ServerComposerForm onValidSubmit={() => {}}/>);
    const cpuCombo = screen.getByRole("combobox", { name: /cpu/i });
    act(() => {
      cpuCombo.click();
    });
    const listbox = await screen.findByRole("listbox");
    const option = within(listbox).getByRole("option", { name: /^x86$/i });
    act(() => {
      option.click();
    });

    await waitFor(() => {
      expect(within(cpuCombo).getByText("X86")).toBeVisible();
    });
  });

  test("Invalid memory size format", async () => {
    render(<ServerComposerForm onValidSubmit={() => {}}/>);

    const memorySizeInput = screen.getByLabelText("Memory Size");
    act(() => {
      fireEvent.change(memorySizeInput, {target: {value: "1024"}});
      screen.getByText("Submit").click();
    });

    await waitFor(() => {
      expect(screen.getByText("Comma separated positive integer only")).toBeVisible();
    });
  });

  test.each([
    { name: "invalid format", input: "1024", errorMessage: "Comma separated positive integer only" },
    { name: "invalid format (long)", input: "83,88,608", errorMessage: "Comma separated positive integer only" },
    { name: "negative number", input: "-1,024", errorMessage: "Comma separated positive integer only" },
    { name: "less than 1024", input: "16", errorMessage: "Must be multiple of 1024 and a power of 2" },
    { name: "not a power of 2", input: "12,345", errorMessage: "Must be multiple of 1024 and a power of 2" },
    { name: "bigger than 8388608", input: "16,777,216", errorMessage: "Must be at or below 8,388,608" },
  ])("Invalid memory size: $name", async ({input, errorMessage}) => {
    render(<ServerComposerForm onValidSubmit={() => {}}/>);

    const memorySizeInput = screen.getByLabelText("Memory Size");
    act(() => {
      fireEvent.change(memorySizeInput, {target: {value: input}});
      screen.getByText("Submit").click();
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeVisible();
    });
  });

  test.each([
    { input: "2,048" },
    { input: "4,096" },
    { input: "8,192" },
    { input: "16,384" },
    { input: "8,388,608" },
  ])("Valid memory size: $input", async ({input}) => {
    const onValidSubmit = jest.fn();
    render(<ServerComposerForm onValidSubmit={onValidSubmit}/>);
    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const x86Option = await screen.findByRole("option", { name: /^x86$/i });
    act(() => {
      x86Option.click();

      const memorySizeInput = screen.getByLabelText("Memory Size");
      fireEvent.change(memorySizeInput, {target: {value: input}});
      screen.getByText("Submit").click();
    });

    await waitFor(() => {
      expect(onValidSubmit).toBeCalled();
    });
  });

  test("GPU checkbox is selectable", async () => {
    render(<ServerComposerForm onValidSubmit={() => {}}/>);
    act(() => {
      screen.getByLabelText("GPU Accelerator Card").click();
    });

    await waitFor(() => {
      expect(screen.getByLabelText("GPU Accelerator Card")).toBeChecked();
    });
  });

  test("Submit call the onValidSubmit fucntion without gpu", async () => {
    const onValidSubmit = jest.fn();
    render(<ServerComposerForm onValidSubmit={onValidSubmit}/>);

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const x86Option = await screen.findByRole("option", { name: /^x86$/i });
    act(() => {
      x86Option.click();

      const memorySizeInput = screen.getByLabelText("Memory Size");
      fireEvent.change(memorySizeInput, {target: {value: "4,096"}});
      screen.getByText("Submit").click();
    });

    await waitFor(() => {
      expect(onValidSubmit).toBeCalledTimes(1);
      expect(onValidSubmit).toHaveBeenCalledWith({
        cpu: "x86",
        memorySize: 4096,
        gpu: false
      });
    });
  });

  test("Submit call the onValidSubmit fucntion with gpu", async () => {
    const onValidSubmit = jest.fn();
    render(<ServerComposerForm onValidSubmit={onValidSubmit}/>);

    act(() => {
      screen.getByLabelText("CPU").click();
    });
    const x86Option = await screen.findByRole("option", { name: /^power$/i });
    act(() => {
      x86Option.click();

      const memorySizeInput = screen.getByLabelText("Memory Size");
      fireEvent.change(memorySizeInput, {target: {value: "16,384"}});
      
      screen.getByLabelText("GPU Accelerator Card").click();
      
      screen.getByText("Submit").click();
    });
    
    await waitFor(() => {
      expect(onValidSubmit).toBeCalledTimes(1);
      expect(onValidSubmit).toHaveBeenCalledWith({
        cpu: "power",
        memorySize: 16384,
        gpu: true
      });
    });
  });
});
