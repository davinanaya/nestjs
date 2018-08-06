import { UserVm } from "user/models/view-models/user-vm.mode";

export class LoginResponseVm{
    token: string;
    user: UserVm;
}