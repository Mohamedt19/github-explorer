import { useEffect, useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange(local), 350);
    return () => clearTimeout(t);
  }, [local, onChange]);

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <input
        className="input"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search GitHub username (e.g. torvalds)"
        style={{ flex: 1 }}
      />
      <button className="btn" onClick={() => onChange(local)}>
        Search
      </button>
    </div>
  );
}