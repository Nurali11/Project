import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, Length, Max, Min } from "class-validator"

export class CreateRestarauntDto {
    @ApiProperty()
    @IsString()
    name: string
    
    @ApiProperty()
    @IsString()
    regionId: string
    
    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(100)
    tip: number
    
    @ApiProperty()
    @IsString()
    address: string
    
    @ApiProperty({
        example: "+998901234567"
    })
    @Length(13)
    @IsString()
    phone: string
    
    @ApiProperty()
    isActive: boolean
}

