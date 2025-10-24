import { Module } from '@nestjs/common'
import { PrismaModule } from '../config/prisma/prisma.module'
import { RepositoryProviders } from 'src/providers/repository.provider'
import { ProductsController } from './products.controller'
import { CreateProductUseCase } from './use-cases/create-product.use-case'
import { FetchPrductsUseCase } from './use-cases/fetch-products.use-case'


@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    FetchPrductsUseCase,
    ...RepositoryProviders,
  ],
  exports: [
    CreateProductUseCase,
    FetchPrductsUseCase,

    ...RepositoryProviders
  ],
})
export class ProductsModule { }