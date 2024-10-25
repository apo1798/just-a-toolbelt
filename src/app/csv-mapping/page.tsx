"use client";
import { useState } from "react";

const Page = () => {
  const [skipFirstLine, setSkipFirstLine] = useState(true);
  const [text, setText] = useState(`Column,Mapping Value,Source Value
sex,male,M
sex,female,F
name,@format:@trim:{last_name}{first_name},
is_active,0,8
is_active,0,9
is_active,0,“8”
is_active,0,"9"
is_active,1,0
is_active,1,“0”
is_active,1,“L”`);

  const object = text.split("\n").reduce(
    (acc, cur, i) => {
      if (skipFirstLine && i === 0) {
        return acc;
      }

      const [property, name, ...values] = cur.split(",");
      if (!property || !name) {
        return acc;
      }

      if (name.startsWith("@")) {
        acc[property] = name;
        return acc;
      }

      if (!acc[property]) {
        acc[property] = {};
      }

      const parsedValues = values.map((value) => {
        if (!Number.isNaN(Number(value)) && !Number.isNaN(parseInt(value))) {
          return Number(value);
        } else if (value === "true") {
          return true;
        } else if (value === "false") {
          return false;
        } else if (value === "null") {
          return null;
        } else if (value.startsWith('"') && value.endsWith('"')) {
          return value.replace(/^"/, "").replace(/"$/, "");
        }
        return value;
      });

      if (
        (typeof acc[property] === "object" &&
          !Array.isArray(acc[property]) &&
          acc[property] !== null) ||
        typeof acc[property] === "undefined"
      ) {
        const keyObject = acc[property] as Record<string, unknown[]>;
        keyObject[name] =
          keyObject[name] && Array.isArray(keyObject[name])
            ? [...keyObject[name], ...parsedValues]
            : parsedValues;
        return acc;
      }

      return acc;
    },
    {} as Record<string, Record<string, unknown[]> | string>,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-2 p-6">
      <h1 className="text-lg">測試測試</h1>
      <div>
        <label>
          <input
            type="checkbox"
            checked={skipFirstLine}
            onChange={(e) => {
              setSkipFirstLine(e.target.checked);
            }}
          />{" "}
          忽略第一行
        </label>
      </div>
      <div className="flex gap-10">
        <textarea
          value={text}
          onChange={(v) => setText(v.target.value)}
          className="!h-[60vh] basis-1/2 rounded border p-2 text-lg"
        />
        <pre className="basis-1/2 rounded bg-gray-100 p-2 text-sm dark:bg-gray-800">
          {JSON.stringify(object, null, 2)}
        </pre>
      </div>
    </div>
  );
};
export default Page;
