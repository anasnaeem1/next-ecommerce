import Category from "../../../../models/Category";
import { connectDb } from "../../../../config/db";
import { CollectionProvider } from "@/context/CollectionContext";
import CollectionsContent from "@/components/admin/CollectionsContent";
import { getProducts } from "@/serverActions/Product/productActions";
import { ProductType } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

const Collections = async ({ searchParams }: PageProps) => {
  await connectDb();

  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams?.category || null;
  const { products } = await getProducts(categoryParam as any);

  const categoryDoc: any = await Category.findOne().lean();
  const categories =
    categoryDoc?.categories?.map((item: { key: string; label: string }) => ({
      key: item.key,
      label: item.label,
    })) || [];

  return (
    <div className="min-h-[calc(100vh-150px)]">
      <CollectionProvider
        initialProducts={(products || []) as ProductType[]}
        initialCategory={categoryParam}
      >
        <CollectionsContent categories={categories} />
      </CollectionProvider>
    </div>
  );
};

export default Collections;
