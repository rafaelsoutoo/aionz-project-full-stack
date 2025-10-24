import { Inject } from "@nestjs/common"
import { ProductsRepository } from "../repositories/products.repository"
import { ProductEntity } from "../entities/product.entity"
import { normalizeUpper } from "src/utils/normalization"

interface PrductsUseCaseRequest {
    page: number
    limit: number
    query?: string
}

interface PrductsUseCaseResponse {
    produtos: ProductEntity[],
    hasNextPage: boolean
}

export class FetchPrductsUseCase {

    private readonly BASE_URL = process.env.BASE_URL || 'http://localhost:3333';



    constructor(
        @Inject(ProductsRepository) private prductsRepository: ProductsRepository,
    ) { }

    async execute({
        page,
        limit,
        query,
    }: PrductsUseCaseRequest): Promise<PrductsUseCaseResponse> {

        const queryNormalize = normalizeUpper(query);
        

        const { produtos, hasNextPage } = await this.prductsRepository.fetchMany(

            page,
            limit,
            queryNormalize,
        );

        const baseUrl = this.BASE_URL.replace(/\/$/, ''); 

        const produtosComImagem = produtos.map((produto) => ({
            ...produto,
            imagem: produto.imagem
                ? `${baseUrl}/${produto.imagem.replace(/^\/+/, '')}` 
                : '',
        }));


        return {
            produtos: produtosComImagem,
            hasNextPage,
        };
    }

}