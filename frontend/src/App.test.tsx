import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "./App";
import * as copyClipboard from "./clipboard/copyText";
import { saveHistory } from "./history/translationHistory";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("App", () => {
  it("shows error when API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/portuguese text/i), "Olá");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not reach the translation service/i,
    );
  });

  it("shows successful translation from API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ translation: "Hello" }),
      }),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/portuguese text/i), "Olá");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText("Hello", { selector: ".translation" }),
    ).toBeInTheDocument();
  });

  it("adds successful translation to history", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ translation: "Hello" }),
      }),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/portuguese text/i), "Olá");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText("Hello", { selector: ".translation" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Olá", { selector: ".history-source" })).toBeInTheDocument();
  });

  it("loads history from localStorage on mount", () => {
    saveHistory(localStorage, [{ source: "Oi", translation: "Hi" }]);
    render(<App />);
    expect(screen.getByText("Hi", { selector: ".history-translation" })).toBeInTheDocument();
  });

  it("does not add history entry when submit fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ detail: "nope" }),
      }),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/portuguese text/i), "Olá");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/no saved translations yet/i)).toBeInTheDocument();
  });

  it("clears history when Clear history is clicked", async () => {
    saveHistory(localStorage, [{ source: "Oi", translation: "Hi" }]);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /clear history/i }));
    expect(screen.getByText(/no saved translations yet/i)).toBeInTheDocument();
  });

  it("disables Copy translation before a successful translation exists", () => {
    render(<App />);
    expect(
      screen.getByRole("button", { name: /copy translation/i }),
    ).toBeDisabled();
  });

  it("copies the current English translation to the clipboard", async () => {
    const copyTextSpy = vi
      .spyOn(copyClipboard, "copyText")
      .mockResolvedValue({ ok: true });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ translation: "Hello" }),
      }),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/portuguese text/i), "Olá");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    const copyButton = await screen.findByRole("button", {
      name: /copy translation/i,
    });
    expect(copyButton).not.toBeDisabled();

    await user.click(copyButton);
    expect(copyTextSpy).toHaveBeenCalledWith("Hello");
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });

  it("shows copy error when clipboard fails", async () => {
    vi.spyOn(copyClipboard, "copyText").mockResolvedValue({
      ok: false,
      message: "Could not copy to clipboard.",
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ translation: "Hello" }),
      }),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/portuguese text/i), "Olá");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await user.click(
      await screen.findByRole("button", { name: /copy translation/i }),
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      /could not copy/i,
    );
  });
});
