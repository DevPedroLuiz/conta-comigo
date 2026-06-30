import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { AuditLogService } from "../../shared/application/audit-log.service";
import { User } from "../../shared/domain/models";
import { InMemoryDatabase } from "../../shared/infrastructure/in-memory-database";
import { LoginDto, RefreshDto, RegisterDto, UpdateProfileDto } from "./dto";

@Injectable()
export class IdentityService {
  constructor(
    private readonly database: InMemoryDatabase,
    private readonly jwtService: JwtService,
    private readonly audit: AuditLogService
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    if ([...this.database.users.values()].some((user) => user.email === email)) {
      throw new BadRequestException("E-mail already registered");
    }

    if (!dto.name?.trim() || !dto.password || dto.password.length < 6) {
      throw new BadRequestException("Name and a password with at least 6 characters are required");
    }

    const now = this.database.now();
    const user: User = {
      id: this.database.newId(),
      name: dto.name.trim(),
      email,
      passwordHash: await bcrypt.hash(dto.password, 10),
      kind: dto.kind ?? "person",
      createdAt: now,
      updatedAt: now
    };

    this.database.users.set(user.id, user);
    this.audit.record(user.id, "USER_REGISTERED", "User", user.id);
    return this.createSession(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = [...this.database.users.values()].find((candidate) => candidate.email === email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    this.audit.record(user.id, "USER_LOGGED_IN", "User", user.id);
    return this.createSession(user);
  }

  refresh(dto: RefreshDto) {
    const token = this.database.refreshTokens.get(dto.refreshToken);
    if (!token || new Date(token.expiresAt).getTime() < Date.now()) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = this.database.users.get(token.userId);
    if (!user) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    this.database.refreshTokens.delete(dto.refreshToken);
    return this.createSession(user);
  }

  getProfile(userId: string) {
    const user = this.requireUser(userId);
    return this.toPublicUser(user);
  }

  updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = this.requireUser(userId);
    const updated = {
      ...user,
      name: dto.name?.trim() || user.name,
      kind: dto.kind ?? user.kind,
      updatedAt: this.database.now()
    };
    this.database.users.set(userId, updated);
    this.audit.record(userId, "USER_PROFILE_UPDATED", "User", userId);
    return this.toPublicUser(updated);
  }

  private createSession(user: User) {
    const refreshToken = randomBytes(32).toString("hex");
    this.database.refreshTokens.set(refreshToken, {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
    });

    return {
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email }),
      refreshToken,
      user: this.toPublicUser(user)
    };
  }

  private requireUser(userId: string) {
    const user = this.database.users.get(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }

  private toPublicUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      kind: user.kind,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

