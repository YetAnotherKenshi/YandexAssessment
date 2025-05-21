import React, { useState, useRef } from "react";

const HighlightableText = () => {
  const [highlights, setHighlights] = useState([]);
  const [error, setError] = useState("");
  const textRef = useRef(null);

  const textContent =
    "This is a sample text. You can highlight portions of this text.";

  const handleHighlight = () => {
    setError(""); // Clear previous error

    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === "") {
      setError("No text selected. Please select a valid portion of the text.");
      return;
    }

    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    // Check if selection is within the same parent (required for clean highlighting)
    if (!textRef.current.contains(range.commonAncestorContainer)) {
      setError("Selection must be within the specified text.");
      return;
    }

    // Collision detection
    for (const highlight of highlights) {
      if (
        (startOffset >= highlight.start && startOffset < highlight.end) || // Start inside
        (endOffset > highlight.start && endOffset <= highlight.end) || // End inside
        (startOffset <= highlight.start && endOffset >= highlight.end) // Overlaps entirely
      ) {
        setError(
          "Selection overlaps an existing highlight. Please choose a different area."
        );
        return;
      }
    }

    // Add the new highlight
    setHighlights([...highlights, { start: startOffset, end: endOffset }]);

    // Clear selection
    selection.removeAllRanges();
  };

  const renderHighlightedText = () => {
    if (highlights.length === 0) return textContent;

    let lastIndex = 0;
    const elements = [];

    // Sort highlights by starting position
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    sortedHighlights.forEach((highlight, index) => {
      // Add unhighlighted text before the highlight
      if (highlight.start > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {textContent.slice(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add the highlighted text
      elements.push(
        <span
          key={`highlight-${index}`}
          style={{ backgroundColor: "yellow", fontWeight: "bold" }}
        >
          {textContent.slice(highlight.start, highlight.end)}
        </span>
      );

      lastIndex = highlight.end;
    });

    // Add remaining unhighlighted text
    if (lastIndex < textContent.length) {
      elements.push(
        <span key={`text-end`}>{textContent.slice(lastIndex)}</span>
      );
    }

    return elements;
  };

  return (
    <div>
      <div
        ref={textRef}
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          cursor: "text",
          userSelect: "text",
        }}
      >
        {renderHighlightedText()}
      </div>
      <button
        onClick={handleHighlight}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        Highlight Selection
      </button>
      {error && <div style={{ marginTop: "10px", color: "red" }}>{error}</div>}
    </div>
  );
};

export default HighlightableText;
