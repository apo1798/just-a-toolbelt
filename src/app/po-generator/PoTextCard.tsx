import { Check, ChevronDown, ChevronUp, Copy, FileWarning } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type Props = {
  index: number;
  text: string[][];
  isLast: boolean;
  contentType: "po" | "json";
};

const PoTextCard = ({ index, text, isLast, contentType }: Props) => {
  const [isCardOpen, setIsCardOpen] = useState(true);
  const [isCopySuccess, setIsCopySuccess] = useState(false);
  const timerRef = useRef<number | null>(null);

  let hasNoMatchingValue = false;

  const getText = (texts: string[][], contentType: "po" | "json") => {
    switch (contentType) {
      case "po": {
        const result = texts
          .map((text) => {
            const matchingValue = text.at(index + 1);

            if (!matchingValue && !isLast) {
              hasNoMatchingValue = true;
            }

            return `msgid "${text.at(0)}"\nmsgstr "${matchingValue?.replaceAll(`"`, `\\"`) ?? ""}"\n`;
          })
          .join("\n");

        return result;
      }
      case "json": {
        const result = texts.reduce(
          (acc, cur) => {
            if (!cur.at(index) && !isLast) {
              hasNoMatchingValue = true;
            }
            acc[cur.at(0)!] = cur.at(index + 1) ?? "";

            return acc;
          },
          {} as Record<string, string>,
        );
        return JSON.stringify(result, null, 2);
      }
      default: {
        return "";
      }
    }
  };

  const generatedText = getText(text, contentType);

  return (
    <Collapsible open={isCardOpen} onOpenChange={setIsCardOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="space-x-2">
            <span>Section {index + 1}</span>
            {hasNoMatchingValue && (
              <span className="inline-flex items-center gap-1 text-sm text-red-500">
                <FileWarning className="h-4 w-4" />
                這裡有遺失的值喔！
              </span>
            )}
          </CardTitle>
          <div className="ml-auto inline-flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button className="inline-flex justify-between" variant="ghost">
                <span>{isCardOpen ? "收合" : "展開"}</span>
                <span>{isCardOpen ? <ChevronUp /> : <ChevronDown />}</span>
              </Button>
            </CollapsibleTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    aria-label="copy"
                    className="px-2"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(generatedText);
                        setIsCopySuccess(true);

                        timerRef.current = window.setTimeout(
                          () => setIsCopySuccess(false),
                          2000,
                        );
                        toast.success("Copied!");
                      } catch (e) {
                        //pass
                      }
                    }}
                  >
                    {isCopySuccess ? (
                      <Check className="h-6 w-6 text-green-700" />
                    ) : (
                      <Copy className="h-6 w-6" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>複製</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="mx-6 mb-4 whitespace-pre-wrap break-words rounded border-2 border-primary p-2 font-mono text-sm font-medium">
            {generatedText}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
export default PoTextCard;
