/**
 * What users themselves get back from the API
 */

import { ApiProperty } from '@nestjs/swagger';


/**
 * Reflectedd back to the user on login.
 */
export class UserOwnInfoDto {
    readonly displayName: string;
    readonly email: string;
    readonly publicId: string;
    readonly phone: string;
}
