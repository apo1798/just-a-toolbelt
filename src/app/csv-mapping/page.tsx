"use client";
import { useState } from "react";

const Page = () => {
  const [text, setText] = useState(`sex,male,M
sex,male,M2, 
sex,female,F
name,@format:@trim:{last_name}{first_name}
is_active,0, 8, 9,"8","9"
is_active,1, 0,L`);

  const object = text.split("\n").reduce(
    (acc, cur) => {
      const [property, name, ...values] = cur.split(",");
      if (!property || !name) {
        return acc;
      }
      console.log({ property, name, values });

      if (name.trim().startsWith("@")) {
        acc[property] = name.trim();
        return acc;
      }

      if (!acc[property.trim()]) {
        acc[property.trim()] = {};
      }

      // console.log("values", values);
      const parsedValues = values.map((value) => {
        if (!Number.isNaN(Number(value)) && value.trim().length > 0) {
          return Number(value);
        } else if (value.trim() === "true") {
          return true;
        } else if (value.trim() === "false") {
          return false;
        }
        console.log({ value });
        return value.replaceAll('"', "");
      });

      // @ts-expect-error asd
      acc[property][name.trim()] = parsedValues;
      return acc;
    },
    {} as Record<string, Record<string, unknown[]> | string>,
  );

  console.log(object);

  return (
    <div className="mx-auto max-w-7xl  p-6">
      <h1 className="text-lg">測試測試</h1>
      <div className="flex gap-10">
        <textarea
          value={text}
          onChange={(v) => setText(v.target.value)}
          className="!h-[60vh] basis-1/2 rounded border p-2"
        />
        <pre className="basis-1/2 rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
          {JSON.stringify(object, null, 2)}
        </pre>
      </div>
    </div>
  );
};
export default Page;
