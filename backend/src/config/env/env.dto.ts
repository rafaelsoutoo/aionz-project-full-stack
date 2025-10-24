import { IsEnum, IsNumber, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

export enum DatabaseType {
    PRISMA = 'prisma',
}

export class EnvVariables {
    @IsEnum(['dev', 'test', 'production'])
    NODE_ENV: 'dev' | 'test' | 'production' = 'dev'

    @Transform(({ value }) => Number(value))
    @IsNumber()
    PORT: number = 3333


    @IsString()
    DATABASE_URL: string

}