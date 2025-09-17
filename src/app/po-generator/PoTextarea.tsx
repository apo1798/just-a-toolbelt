"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useState } from "react";
import { z } from "zod";

import PoTextCard from "~/app/po-generator/PoTextCard";
import { RepeatedKeyWarning } from "~/app/po-generator/RepetedKeyWarning";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";

const poInputAtom = atomWithStorage("poInput", "");
const contentTypeAtom = atomWithStorage<"po" | "json">("contentType", "po");

const PoTextarea = () => {
  const [separator, setSeparator] = useState("\\t");
  const [excludeKeyWords, setExcludeKeyWords] = useState("(已有)");
  const [poInput, setPoInput] = useAtom(poInputAtom);
  const [contentType, setContentType] = useAtom(contentTypeAtom);

  let replacedSeparator = separator;
  if (replacedSeparator in escapeCodes) {
    replacedSeparator =
      escapeCodes[replacedSeparator as keyof typeof escapeCodes];
  }

  const preSplitText = poInput
    .split("\n")
    .map((item) => {
      return item.split(replacedSeparator);
    })
    .reduce((acc, cur) => {
      const pattern = /^[a-zA-Z][a-zA-Z0-9.]*$/;
      const isCorrectKeySplit =
        pattern.test(cur?.at(0) ?? "") &&
        cur?.at(0)?.replace(/.$/, "")?.includes(".");
      console.log({ isCorrectKeySplit }, cur, {
        1: pattern.test(cur?.at(0) ?? ""),
        2: cur?.at(0)?.replace(/.$/, "")?.includes("."),
      });

      if (!isCorrectKeySplit) {
        const updatedLastItem = [
          ...(acc?.at(-1)?.slice(0, -1) ?? []),
          (acc?.at(-1)?.at(-1) ?? "") + "\\n" + cur?.at(0),
          ...cur.slice(1),
        ];
        acc[acc.length - 1] = updatedLastItem;
      } else {
        acc.push(cur);
      }
      return acc;
    }, [] as string[][]);

  const correspondingText = preSplitText.filter((item) => {
    if (!excludeKeyWords) return true;
    return !item.at(0)?.includes(excludeKeyWords);
  });

  const keyLength = correspondingText?.at(0)?.length ?? 0;
  const repeatedKeyCounts =
    Array.isArray(correspondingText) &&
    correspondingText.reduce(
      (acc, cur) => {
        const key = cur.at(0);
        if (key && key in acc) {
          acc[key] = acc[key] + 1;
        } else if (key) {
          acc[key] = 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  const hasRepeatedKeys = Object.values(repeatedKeyCounts).some(
    (count) => count > 1,
  );

  return (
    <div className="my-8 flex min-w-0 flex-col gap-10 lg:flex-row">
      <section className="shrink-0 grow basis-1/2 space-y-4">
        <div className="space-y-1">
          <Label htmlFor="separator" className="text-primary">
            分隔符號
          </Label>
          <Input
            id="separator"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="h-9 max-w-xs px-2 py-1 leading-3"
            placeholder="\t"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="exclude-key-words" className="text-primary">
            當 key 包含以下內容時，排除
          </Label>
          <Input
            id="exclude-key-words"
            value={excludeKeyWords}
            onChange={(e) => setExcludeKeyWords(e.target.value)}
            className="h-9 max-w-xs px-2 py-1 leading-3"
            placeholder="已有"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="po-input" className="text-primary">
            翻譯表格內容
          </Label>
          <Textarea
            id="po-input"
            value={poInput}
            onChange={(e) => setPoInput(e.target.value)}
            className="min-h-[20rem] text-sm"
            placeholder="download  下載  download"
          />
        </div>
        {hasRepeatedKeys && (
          <RepeatedKeyWarning repeatedKeyCounts={repeatedKeyCounts} />
        )}
      </section>

      <section className="grow basis-1/2 space-y-3">
        <div className="flex items-center gap-x-4">
          <div className="text-yellow-400">內容格式</div>
          <Select
            value={contentType}
            onValueChange={(value) => {
              const result = z.enum(["json", "po"]).safeParse(value);
              if (result.success) {
                setContentType(result.data);
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="請選擇內容格式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="po">PO</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <hr />

        {Array.from({ length: keyLength }).map((_, i) => {
          if (!correspondingText) return null;
          const isLast = keyLength === i + 1;

          return (
            <PoTextCard
              key={i}
              text={correspondingText}
              index={i}
              isLast={isLast}
              contentType={contentType}
            />
          );
        })}
      </section>
    </div>
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
