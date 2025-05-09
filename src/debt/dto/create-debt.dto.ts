import { ApiProperty } from "@nestjs/swagger"
import { IsUUID, Min } from "class-validator"

export class CreateDebtDto {
    @ApiProperty()
    @IsUUID()
    orderId: string

    @ApiProperty()
    @IsUUID()
    restaurantId: string

    @ApiProperty()
    username: string

    @ApiProperty()
    @Min(0)
    amount: number
}
