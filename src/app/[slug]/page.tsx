import ProductDetailsPage from "./ProductDetailsPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page = async ({ params }: PageProps) => {
  return <ProductDetailsPage />;
};

export default Page;
