import { useState } from "react";
import "./comboBox.css";
interface Option {
  label: string;
  value: string;
}

interface ComboBoxProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ComboBox = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = options.find((o) => o.value === value);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="combobox">
      <div className="combobox-input" onClick={() => setOpen(!open)}>
        {selected ? selected.label : placeholder}
      </div>

      {open && (
        <div className="combobox-dropdown">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="combobox-options">
            {filtered.map((o) => (
              <div
                key={o.value}
                className="combobox-option"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {o.label}
              </div>
            ))}

            {filtered.length === 0 && <div className="no-data">No results</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboBox;
