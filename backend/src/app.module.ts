import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { RepositoryProviders } from './providers/repository.provider';
import { ProductsModule } from './products/products.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule
  ],
  providers: [...RepositoryProviders],
})
export class AppModule { }