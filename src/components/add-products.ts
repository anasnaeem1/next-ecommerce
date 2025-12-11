"use server";   


const addProdcts = (products: any[]) => {   
    return products.map((product) => {
        return {
        id: product.id,
        name: product.name,
        basePrice: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
        stock: product.stock,
        };
    });
    }