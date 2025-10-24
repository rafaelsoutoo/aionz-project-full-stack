import { Body, Controller, FileTypeValidator, Get, HttpCode, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CreateProductDTO } from "./dtos/create-product.dto";
import { CreateProductUseCase } from "./use-cases/create-product.use-case";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { ProductEntity } from "./entities/product.entity";
import { FetchPrductsUseCase } from "./use-cases/fetch-products.use-case";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller('produtos')
export class ProductsController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private fetchPrductsUseCase: FetchPrductsUseCase
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar produto',
    description: 'Cria um novo produto com upload de imagem.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Produto Exemplo' },
        descricao: { type: 'string', example: 'Descrição do produto exemplo' },
        preco: { type: 'number', example: 99.99 },
        categoria: { type: 'string', example: 'Categoria Exemplo' },
        imagem: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem (jpg, jpeg, png, gif, webp) - máx 5MB',
        },
      },
      required: ['nome', 'descricao', 'preco', 'categoria', 'imagem'],
    },
  })
  @ApiOkResponse({
    description: 'Produto criado com sucesso.',
    schema: {
      example: {
        id: 'cuid',
        nome: 'PRODUTO EXEMPLO',
        descricao: 'DESCRIÇÃO DO PRODUTO EXEMPLO',
        preco: 99.99,
        categoria: 'CATEGORIA EXEMPLO',
        imagem: '/uploads/products/1234567890.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('imagem', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Apenas imagens são permitidas!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async createProd(
    @Body() body: CreateProductDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
        fileIsRequired: true,
      }),
    )
    imagem: Express.Multer.File,
  ): Promise<ProductEntity | null> {
    const prod = await this.createProductUseCase.execute({
      nome: body.nome,
      descricao: body.descricao,
      preco: Number(body.preco),
      categoria: body.categoria,
      imagemFile: imagem,
    });

    return prod.produto;
  }



  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limite de itens por página' })
  @ApiQuery({ name: 'query', required: false, type: String, description: 'Filtrar por nome ' })
  @ApiOperation({
    summary: 'Listar produtos',
    description: ' Retorna uma lista de produtos, com filtros opcionais e paginação.',
  })
  @ApiOkResponse({
    description: 'lista de produtos',
    schema: {
      example: {
        produtos: [
          {
            id: 'PRODUCT_ID_1',
            nome: 'PRODUCT NAME ONE',
            descricao: "descricao",
            preco: 100,
            categoria: 'Categoria Exemplo',
            imagem: 'http://exemplo.com/imagem.jpg',
            createdat: '2025-09-03T20:40:41.790Z',
          },
          {
            id: 'PRODUCT_ID_2',
            nome: 'PRODUCT NAME TWO',
            descricao: "descricao",
            preco: 250,
            categoria: 'Categoria Exemplo',
            imagem: 'http://exemplo.com/imagem.jpg',
            createdat: '2025-09-03T20:42:41.975Z',
          },
        ],
        hasNextPage: false,
      },
    },
  })
  async listProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('query') query?: string,

  ): Promise<{ produtos: ProductEntity[]; hasNextPage: boolean }> {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    return this.fetchPrductsUseCase.execute({ page: pageNumber, limit: limitNumber, query });
  }

}