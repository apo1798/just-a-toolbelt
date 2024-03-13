"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import PoTextCard from "~/app/po-generator/PoTextCard";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const poInputAtom = atomWithStorage("poInput", "");

const PoTextarea = () => {
  const [separator, setSeparator] = useState("\\t");
  const [excludeKeyWords, setExcludeKeyWords] = useState("(已有)");
  const [poInput, setPoInput] = useAtom(poInputAtom);

  let replacedSeparator = separator;
  if (replacedSeparator in escapeCodes) {
    replacedSeparator =
      escapeCodes[replacedSeparator as keyof typeof escapeCodes];
  }

  const correspondingText =
    poInput &&
    poInput
      .split("\n")
      .map((item) => {
        return item.split(replacedSeparator);
      })
      .filter((item) => {
        if (!excludeKeyWords) return true;
        return !item.at(0)?.includes(excludeKeyWords);
      });

  const keyLength = correspondingText?.at(0)?.length ?? 0;
  const keyCounts =
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
  const hasRepeatedKeys = Object.values(keyCounts).some((count) => count > 1);
  const isShowWarning = hasRepeatedKeys;

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
        {isShowWarning && (
          <section className="space-y-2 bg-destructive px-3 py-3">
            {hasRepeatedKeys && (
              <>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  <h3>Repeated key warning</h3>
                </div>
                <table className="w-full border-collapse space-y-1">
                  <thead>
                    <tr>
                      <th className="border-2 border-border px-3 py-0.5">
                        Key
                      </th>
                      <th className="border-2 border-border px-3 py-0.5">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(keyCounts)
                      .filter(([, count]) => count > 1)
                      .map(([key, count]) => (
                        <tr key={key}>
                          <td className="border-2 border-border px-3 py-0.5 text-center">
                            {key}
                          </td>
                          <td className="border-2 border-border px-3 py-0.5 text-center">
                            {count}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}
          </section>
        )}
      </section>

      <section className="grow basis-1/2 space-y-3">
        {Array.from({ length: keyLength }).map((_, i) => {
          if (!correspondingText) return null;
          const isLast = keyLength === i + 1;
          let hasNoMatchingValue = false;

          const generatedText = correspondingText
            .map((text) => {
              const matchingValue = text.at(i + 1);

              if (!matchingValue && !isLast) {
                hasNoMatchingValue = true;
              }

              return `msgid "${text.at(0)}"\nmsgstr "${matchingValue ?? ""}"\n`;
            })
            .join("\n");

          return (
            <PoTextCard
              key={i}
              generatedText={generatedText}
              hasNoMatchingValue={hasNoMatchingValue}
              number={i}
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
