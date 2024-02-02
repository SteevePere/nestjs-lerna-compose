import { FindUsersRequest, FindUsersResponse } from '@perspective/shared';

/*This pattern ensures we wrap our base DTOs within an abstraction layer for internal use.
It allows for more flexibility (e.g. you can define additional fields here, etc.)*/
export class FindUsersData extends FindUsersRequest {}

export class FindUsersResult extends FindUsersResponse {}
