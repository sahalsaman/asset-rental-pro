"use client";

import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface MultiSelectProps {
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select options",
}) => {
  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={placeholder}
          aria-label={value.join(", ")}
        >
          {placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            onClick={() => toggle(option.value)}
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              readOnly
              className="mr-2"
            />
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
      <div>
        { value.join(", ") }
      </div>
    </Select>
  );
};

export default MultiSelect;
