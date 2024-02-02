import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { SortOrderEnum } from "../../shared/enums/sort-order.enum";
import { PaginatedRequest } from "../../shared/requests/paginated-request.request";

export class FindUsersRequest extends PaginatedRequest {
  @ApiPropertyOptional({
    enum: SortOrderEnum,
    description: 'Optional parameter to sort Users by creation date',
    example: SortOrderEnum.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrderEnum)
  created?: SortOrderEnum;
}
