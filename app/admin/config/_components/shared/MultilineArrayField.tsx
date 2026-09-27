import React, { useState, useEffect, useRef } from 'react';

interface MultilineArrayFieldProps {
  id: string;
  value: string[] | undefined;
  onChange: (items: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

/**
 * Controlled textarea for editing array-of-strings fields (1 item per line).
 * Maintains local string state during editing so pressing Enter to create newlines
 * works seamlessly without being prematurely swallowed or stripped by array filtering.
 */
export function MultilineArrayField({
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
  rows = 6,
  className = 'w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50 font-mono',
}: MultilineArrayFieldProps) {
  const incomingText = (value || []).join('\n');
  const [text, setText] = useState(incomingText);
  const prevExternalRef = useRef(incomingText);

  // Synchronize internal text only if the external array changed from outside
  useEffect(() => {
    if (incomingText !== prevExternalRef.current) {
      setText(incomingText);
      prevExternalRef.current = incomingText;
    }
  }, [incomingText]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value;
    setText(raw);

    const cleaned = raw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    prevExternalRef.current = cleaned.join('\n');
    onChange(cleaned);
  };

  const handleBlur = () => {
    const cleaned = text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const formatted = cleaned.join('\n');
    setText(formatted);
    prevExternalRef.current = formatted;
    onChange(cleaned);
  };

  return (
    <textarea
      id={id}
      rows={rows}
      value={text}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      className={className}
    />
  );
}
