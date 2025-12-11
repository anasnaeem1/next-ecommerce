import { ProductProvider } from "../../../context/ProductContext";
import { getProductDetails } from "../../serverActions/Product./productActions";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ProductLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  
  // Fetch product data on the server
  const { success, product, images, variants, message } = await getProductDetails(slug);

  const productDetails = success && product ? product : null;
  const productImages = Array.isArray(images) ? images : productDetails?.images || [];
  const productVariants = Array.isArray(variants) ? variants : productDetails?.variants || [];
  const productId = productDetails?._id || null;

  return (
    <ProductProvider
      initialProduct={productDetails}
      initialImages={productImages}
      initialVariants={productVariants}
      initialProductId={productId}
      initialSlug={slug}
    >
      {children}
    </ProductProvider>
  );
}

