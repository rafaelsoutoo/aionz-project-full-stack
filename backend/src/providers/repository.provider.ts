import { Provider } from '@nestjs/common'
import { env } from 'src/config/env'
import { PrismaProductRepository } from 'src/products/repositories/prisma/prisma-product.repository'
import { ProductsRepository } from 'src/products/repositories/products.repository'

const repositoryConfigs = [
    {
        token: ProductsRepository,
        prisma: PrismaProductRepository,
    },

]

function createRepositoryProviders(configs: typeof repositoryConfigs): Provider[] {
    return configs.flatMap(cfg => [
        {
            provide: cfg.token,
            useFactory: (prismaRepo: any) => {
                return prismaRepo
            },
            inject: [cfg.prisma],
        },
        cfg.prisma,

    ])
}

export const RepositoryProviders: Provider[] = createRepositoryProviders(repositoryConfigs)