import { PaginatedResponse } from "../../shared/responses/paginated-response.response";
import { UserObject } from "../objects/user.object";

export class FindUsersResponse extends PaginatedResponse<UserObject> {}
