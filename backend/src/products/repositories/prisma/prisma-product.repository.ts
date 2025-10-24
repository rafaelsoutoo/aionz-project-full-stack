import { Injectable } from '@nestjs/common'
import { prisma } from 'src/config/prisma/prisma'
import { ProductsRepository } from '../products.repository'
import { ProductEntity } from 'src/products/entities/product.entity'

@Injectable()
export class PrismaProductRepository implements ProductsRepository {

    async create(data: ProductEntity): Promise<ProductEntity> {
        const prod = await prisma.produto.create({
            data: {
                nome: data.nome,
                descricao: data.descricao,
                preco: data.preco,
                categoria: data.categoria,
                imagem: data.imagem,
            },
        });
        return prod
    }

    async fetchMany(
        page: number,
        limit: number,
        query?: string,
    ): Promise<{ produtos: ProductEntity[]; hasNextPage: boolean }> {
        const where: any = {};

        if (query) {
            where.nome = {
                contains: query,
                mode: 'insensitive',
            };
        }

        const results = await prisma.produto.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit + 1,
            orderBy: [
                { createdAt: 'desc' },
            ],
        });

        const hasNextPage = results.length > limit;
        const products = hasNextPage ? results.slice(0, limit) : results;

        return {
            produtos: products.map((product) => ({
                id: product.id,
                nome: product.nome,
                descricao: product.descricao,
                preco: product.preco,
                categoria: product.categoria,
                imagem: product.imagem,
                createdAt: product.createdAt,
            })),
            hasNextPage,
        };
    }
}