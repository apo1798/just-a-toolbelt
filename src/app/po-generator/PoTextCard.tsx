import { Check, ChevronDown, ChevronUp, Copy, FileWarning } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
  number: number;
  generatedText: string;
  hasNoMatchingValue: boolean;
};

const PoTextCard = ({ number, generatedText, hasNoMatchingValue }: Props) => {
  const [isCardOpen, setIsCardOpen] = useState(true);
  const [isCopySuccess, setIsCopySuccess] = useState(false);
  const timerRef = useRef<number | null>(null);

  return (
    <Collapsible open={isCardOpen} onOpenChange={setIsCardOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="space-x-2">
            <span>PO Section {number + 1}</span>
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
          <CardContent className="mx-6 mb-4 whitespace-pre-line break-words rounded border-2 border-primary p-2">
            {generatedText}
          </CardContent>
        </CollapsibleContent>
        <CardFooter></CardFooter>
      </Card>
    </Collapsible>
  );
};
export default PoTextCard;
