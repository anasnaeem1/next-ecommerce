import InventoryProductDetails from "../../../../components/InventoryProductDetails";

// Disable caching to ensure fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const ProductInventoryPage = async ({ params }: PageProps) => {
  return <InventoryProductDetails />;
};

export default ProductInventoryPage;
