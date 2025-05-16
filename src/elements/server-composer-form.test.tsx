import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";
import { isValidMemorySize, ServerComposerForm } from "./server-composer-form";
import userEvent from "@testing-library/user-event";

test.each([
  { name: "number below 1024", value: 2, expectedResult: false },
  { name: "negative number", value: -2, expectedResult: false },
  { name: "not a power of 2", value: 2047, expectedResult: false },
  { name: "power of 2", value: 2048, expectedResult: true },
])("Test isValidMemorySize $name", ({value, expectedResult}) => {
  expect(isValidMemorySize(value)).toBe(expectedResult);
});


describe("Server composer form", () => {
  test("Have field for CPU, Memory size and GPU", () => {
    render(<ServerComposerForm onValidSubmit={() => {}}/>);
    
    expect(screen.findByLabelText("CPU")).toBeDefined();
    expect(screen.findByLabelText("Memory Size")).toBeDefined();
    expect(screen.findByLabelText("GPU Accelerator Card")).toBeDefined();
  });

  test("CPU dropdown have expected options", () => {
    render(<ServerComposerForm onValidSubmit={() => {}}/>);
    screen.getByLabelText("CPU").click();
    
    expect(screen.getByText("X86")).toBeVisible();
    expect(screen.getByText("Power")).toBeVisible();
    expect(screen.getByText("ARM")).toBeVisible();
  });

  test("Select CPU option", async () => {
    render(<ServerComposerForm onValidSubmit={() => {}}/>);
    const cpuCombo = screen.getByRole("combobox", { name: /cpu/i });
    cpuCombo.click();
    const listbox = await screen.findByRole("listbox");
    const option = await within(listbox).findByRole("option", { name: /^x86$/i });
    option.click();

    await waitFor(() => {
      expect(within(cpuCombo).getByText("X86")).toBeVisible();
    });
  });

  test("Invalid memory size format", async () => {
    render(<ServerComposerForm onValidSubmit={() => {}}/>);

    const memorySizeInput = screen.getByLabelText("Memory Size");
    fireEvent.change(memorySizeInput, {target: {value: "1024"}});
    screen.getByText("Submit").click();
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
    fireEvent.change(memorySizeInput, {target: {value: input}});
    screen.getByText("Submit").click();
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
    screen.getByLabelText("CPU").click();
    (await screen.findByRole("option", { name: /^x86$/i })).click();

    const memorySizeInput = screen.getByLabelText("Memory Size");
    fireEvent.change(memorySizeInput, {target: {value: input}});
    screen.getByText("Submit").click();

    await waitFor(() => {
      expect(onValidSubmit).toBeCalled();
    });
  });

  test("GPU checkbox is selectable", async () => {
    render(<ServerComposerForm onValidSubmit={() => {}}/>);
    screen.getByLabelText("GPU Accelerator Card").click();

    await waitFor(() => {
      expect(screen.getByLabelText("GPU Accelerator Card")).toBeChecked();
    });
  });

  test("Submit call the onValidSubmit fucntion without gpu", async () => {
    const onValidSubmit = jest.fn();
    render(<ServerComposerForm onValidSubmit={onValidSubmit}/>);

    screen.getByLabelText("CPU").click();
    (await screen.findByRole("option", { name: /^x86$/i })).click();

    const memorySizeInput = screen.getByLabelText("Memory Size");
    fireEvent.change(memorySizeInput, {target: {value: "4,096"}});
    screen.getByText("Submit").click();

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

    screen.getByLabelText("CPU").click();
    (await screen.findByRole("option", { name: /^power$/i })).click();

    const memorySizeInput = screen.getByLabelText("Memory Size");
    fireEvent.change(memorySizeInput, {target: {value: "16,384"}});
    
    screen.getByLabelText("GPU Accelerator Card").click();
    
    screen.getByText("Submit").click();
    
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
