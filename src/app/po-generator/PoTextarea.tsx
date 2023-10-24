"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useState } from "react";
import PoTextCard from "~/app/po-generator/PoTextCard";

import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

const poInputAtom = atomWithStorage("poInput", "");

const PoTextarea = () => {
  const [poInput, setPoInput] = useAtom(poInputAtom);
  const [separator, setSeparator] = useState("\\t");

  const correspondingText = poInput.split("\n").map((item) => {
    let inputSeperator = separator;
    if (inputSeperator in escapeCodes) {
      inputSeperator = escapeCodes[inputSeperator as keyof typeof escapeCodes];
    }
    return item.split(inputSeperator);
  });
  // console.log({ separator, poInput });
  console.log({ correspondingText });
  const keyLength = correspondingText?.at(0)?.length ?? 0;

  return (
    <section className="my-10 space-y-4">
      <div className="flex flex-wrap gap-x-2">
        <h2>請貼上 Notion Table 複製來的內容</h2>
      </div>
      <Input
        value={separator}
        onChange={(e) => setSeparator(e.target.value)}
        className="h-9 max-w-xs px-2 py-1 leading-3"
      />
      <div className="space-y-12 md:flex">
        <Textarea
          value={poInput}
          onChange={(e) => setPoInput(e.target.value)}
          className="min-h-[20rem]"
        />
      </div>
      {Array.from({ length: keyLength }).map((_, i) => {
        return (
          <PoTextCard
            key={i}
            textArray={correspondingText}
            number={i}
            isLast={keyLength === i + 1}
          />
        );
      })}
    </section>
  );
};
export default PoTextarea;

const escapeCodes = {
  "\\0": "\0",
  "\\b": "\b",
  "\\t": "\t",
  "\\n": "\n",
  "\\v": "\v",
  "\\f": "\f",
  "\\r": "\r",
} as const;
