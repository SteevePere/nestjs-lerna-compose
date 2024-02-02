import { RegistrationRequest, RegistrationResponse } from '@perspective/shared';

/*This pattern ensures we wrap our base DTOs within an abstraction layer for internal use.
It allows for more flexibility (e.g. you can define additional fields here, etc.)*/
export class RegistrationData extends RegistrationRequest {}

export class RegistrationResult extends RegistrationResponse {}
