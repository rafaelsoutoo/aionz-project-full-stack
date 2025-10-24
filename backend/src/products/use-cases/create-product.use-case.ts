import { ConflictException, Inject } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products.repository'
import { ProductEntity } from '../entities/product.entity'
import { normalizeUpper } from 'src/utils/normalization'

interface CreateProductUseCaseRequest {
  nome: string
  descricao: string
  preco: number
  categoria: string
  imagemFile: Express.Multer.File;
}

interface CreateProductUseCaseResponse {
  produto: ProductEntity | null
}


export class CreateProductUseCase {
  constructor(
    @Inject(ProductsRepository) private productsRepository: ProductsRepository,

  ) { }

  async execute({
    nome,
    descricao,
    preco,
    categoria,
    imagemFile
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {

    const imagemPath = `/uploads/products/${imagemFile.filename}`;


    const prod = await this.productsRepository.create({
      nome: normalizeUpper(nome),
      descricao: normalizeUpper(descricao),
      preco: preco,
      categoria: normalizeUpper(categoria),
      imagem: imagemPath,

    })


    if (!prod) {
      throw new ConflictException('Could not create product')
    }
    const baseUrl =
      process.env.APP_URL || 'http://localhost:3333';
    prod.imagem = `${baseUrl}${prod.imagem}`;


    return { produto: prod }
  }
}