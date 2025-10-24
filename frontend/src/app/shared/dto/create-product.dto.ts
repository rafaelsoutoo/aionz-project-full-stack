export interface CreateProductDto {
  nome: string;
  descricao: string;
  preco: number;
  imagem: File;
  categoria: string;
}