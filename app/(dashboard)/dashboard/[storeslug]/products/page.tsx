import { getProduct } from "@/actions/getProduct";
import { getAllproducts } from "@/actions/getProducts";
import React from "react";

const ProductsPage = async ({
  params,
}: {
  params: Promise<{ storeslug: string }>;
}) => {
  const { storeslug } = await params;
  const data = await getAllproducts(storeslug);
  console.log(data);

  return <div>ProductsPage</div>;
};

export default ProductsPage;
