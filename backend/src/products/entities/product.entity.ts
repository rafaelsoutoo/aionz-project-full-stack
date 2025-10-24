export interface ProductEntity {
    id?: string
    nome: string
    descricao: string
    preco: number
    categoria: string
    imagem: string,
    createdAt?: Date
  }