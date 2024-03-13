import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

const IndexPage = () => {
  return (
    <main className="container space-y-5">
      <div>這裡還沒有東西O_o</div>
      <section>
        <h1 className="text-xl font-medium">現在有的頁面</h1>
        <ul>
          <li>
            <Link
              className={buttonVariants({ variant: "link" })}
              href="po-generator"
            >
              PO 格式轉換器
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
};

export default IndexPage;
