import { AlertTriangle } from "lucide-react";

type Props = {
  repeatedKeyCounts: Record<string, number> | false;
};

export const RepeatedKeyWarning = ({ repeatedKeyCounts }: Props) => {
  return (
    <section className="space-y-2 bg-destructive px-3 py-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-6 w-6" />
        <h3>Repeated key warnings</h3>
      </div>
      <table className="w-full border-collapse space-y-1">
        <thead>
          <tr>
            <th className="border-2 border-border px-3 py-0.5">Key</th>
            <th className="border-2 border-border px-3 py-0.5">Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(repeatedKeyCounts)
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
    </section>
  );
};
