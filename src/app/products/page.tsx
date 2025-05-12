import { cookies } from "next/headers";
import { getProducts } from "@/lib/product.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ProductList from "@/components/ProductList";

export default async function Page() {
  /* This cookie part can be converted into an reusable server-side method to fetch cookies */
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  /* This part can be extracted out in another server side component to simplify the page.tsx */
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: () =>
      getProducts({
        Cookie: `sessionId=${sessionId}`,
      }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductList />
    </HydrationBoundary>
  );
}
