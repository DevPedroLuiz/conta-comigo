import { Body, Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../shared/presentation/current-user.decorator";
import { JwtAuthGuard } from "../../shared/presentation/jwt-auth.guard";
import { AuthenticatedUser } from "../../shared/domain/models";
import { IdentityService } from "./identity.service";
import { LoginDto, RefreshDto, RegisterDto, UpdateProfileDto } from "./dto";

@ApiTags("Auth")
@Controller()
export class IdentityController {
  constructor(private readonly identity: IdentityService) {}

  @Post("auth/register")
  register(@Body() dto: RegisterDto) {
    return this.identity.register(dto);
  }

  @Post("auth/login")
  login(@Body() dto: LoginDto) {
    return this.identity.login(dto);
  }

  @Post("auth/refresh")
  refresh(@Body() dto: RefreshDto) {
    return this.identity.refresh(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("users/me")
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.identity.getProfile(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put("users/me")
  updateMe(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.identity.updateProfile(user.id, dto);
  }
}

