import { FormEvent, useEffect, useState } from "react";

import { translateText } from "./api/translate";
import { copyText } from "./clipboard/copyText";
import {
  clearHistory,
  loadHistory,
  recordSuccessfulTranslation,
  type HistoryEntry,
} from "./history/translationHistory";

function getStorage() {
  return window.localStorage;
}

export function App() {
  const [source, setSource] = useState("");
  const [translation, setTranslation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    setHistory(loadHistory(getStorage()));
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setTranslation(null);
    setCopyFeedback(null);

    const result = await translateText(source);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    setTranslation(result.translation);
    setHistory((prev) =>
      recordSuccessfulTranslation(getStorage(), prev, source, result.translation),
    );
  }

  function onClearHistory() {
    clearHistory(getStorage());
    setHistory([]);
  }

  async function onCopyTranslation() {
    if (!translation) {
      return;
    }
    setCopyFeedback(null);
    const result = await copyText(translation);
    if (!result.ok) {
      setCopyFeedback(result.message);
      return;
    }
    setCopyFeedback("Copied!");
  }

  return (
    <main>
      <h1>Traduz Mat</h1>
      <p>Brazilian Portuguese → English</p>
      <form onSubmit={(e) => void onSubmit(e)}>
        <label htmlFor="source">Text</label>
        <textarea
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          aria-label="Portuguese text"
        />
        <p>
          <button type="submit" disabled={loading}>
            {loading ? "Translating…" : "Submit"}
          </button>
        </p>
      </form>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      <p>
        <button
          type="button"
          aria-label="Copy translation"
          disabled={!translation}
          onClick={() => void onCopyTranslation()}
        >
          Copy translation
        </button>
        {copyFeedback ? (
          <span className="copy-feedback" role="status">
            {copyFeedback}
          </span>
        ) : null}
      </p>
      {translation ? (
        <section className="translation" aria-live="polite">
          {translation}
        </section>
      ) : null}
      <section className="history" aria-label="Translation history">
        <div className="history-header">
          <h2>History</h2>
          {history.length > 0 ? (
            <button type="button" onClick={onClearHistory}>
              Clear history
            </button>
          ) : null}
        </div>
        {history.length === 0 ? (
          <p className="history-empty">No saved translations yet.</p>
        ) : (
          <ul className="history-list">
            {history.map((entry, index) => (
              <li key={`${entry.source}-${entry.translation}-${index}`}>
                <p className="history-source">{entry.source}</p>
                <p className="history-translation">{entry.translation}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
