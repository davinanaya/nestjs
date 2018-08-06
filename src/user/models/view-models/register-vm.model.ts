import { LoginVm } from "user/models/view-models/login-vm.model";
import { ApiModelPropertyOptional } from "@nestjs/swagger";

export class RegisterVm extends LoginVm{
    @ApiModelPropertyOptional() firstName ?: string;
    @ApiModelPropertyOptional() lastName ?: string;
}