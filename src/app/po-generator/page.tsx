import { Metadata } from "next";
import PoTextarea from "~/app/po-generator/PoTextarea";

export const metadata: Metadata = {
  title: "Table 轉 PO 小幫手",
};

const PoGeneratorPage = () => {
  return (
    <main className="container ">
      <h1 className="text-2xl font-medium">
        貼上 Notion 的翻譯表格就可以生成 PO 格式喔！
      </h1>
      <PoTextarea />
    </main>
  );
};
export default PoGeneratorPage;
