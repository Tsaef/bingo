'use client'

import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BingoCellProps {
  id: string;
  value: string;
  onChange: (id: string, value: string) => void;
  isCenter?: boolean;
  isEditable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const BingoCell: FC<BingoCellProps> = ({
  id,
  value,
  onChange,
  isCenter = false,
  isEditable = true,
  isSelected = false,
  onSelect,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={cn(
        "relative aspect-square w-full p-1",
        isEditable ? "cursor-text" : "cursor-pointer"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <div
        className={cn(
          "flex h-full w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white p-2 text-center shadow-sm transition-all",
          (isFocused || isSelected) && "ring-2 ring-primary ring-offset-1"
        )}
      >
        {isEditable ? (
          <Input
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="h-full w-full border-none bg-transparent p-0 text-center focus-visible:ring-0"
            placeholder={isCenter ? "★" : "Écrivez ici"}
          />
        ) : (
          <span className="break-words whitespace-normal overflow-y-auto max-h-full w-full text-sm sm:text-base">
            {value || (isCenter ? "★" : "")}
          </span>
        )}
      </div>
    </motion.div>
  );
};
