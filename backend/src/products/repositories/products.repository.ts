import { ProductEntity } from "../entities/product.entity";

export abstract class ProductsRepository {
    abstract create(data: ProductEntity): Promise<ProductEntity>;
    abstract fetchMany(
        page: number,
        limit: number,
        query?: string
    ): Promise<{ produtos: ProductEntity[]; hasNextPage: boolean; }>;

}