import {
    IsNotEmpty,
    IsString,
    Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDTO {
    @ApiProperty({ description: "Nome do produto" })
    @IsNotEmpty()
    @IsString()
    nome: string;

    @ApiProperty({ description: "Descricao do produto" })
    @IsNotEmpty()
    @IsString()
    descricao: string;

    @ApiProperty({ description: "Preco do produto" })
    @IsNotEmpty()
    preco: number;

    @ApiProperty({ description: "Categoria do produto" })
    @IsNotEmpty()
    @IsNotEmpty()
    categoria: string;


}