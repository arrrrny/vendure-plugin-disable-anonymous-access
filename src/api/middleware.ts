import { Injectable, NestMiddleware, Inject } from "@nestjs/common";
import {
  ConfigService,
  extractSessionToken,
  SessionService,
  CachedSession,
  InternalServerError,
  Logger,
} from "@vendure/core";
import { NextFunction, Request, Response } from "express";
import {
  parse,
  getOperationAST,
  DocumentNode,
  OperationDefinitionNode,
} from "graphql";
import { DisableAnonymousAccessOptions } from "../types";
import { DISABLE_ANONYMOUS_ACCESS_PLUGIN_OPTIONS } from "../constants";

@Injectable()
export class DisableAnonymousAccessMiddleware implements NestMiddleware {
  constructor(
    private sessionService: SessionService,
    private configService: ConfigService,
    @Inject(DISABLE_ANONYMOUS_ACCESS_PLUGIN_OPTIONS)
    private options: DisableAnonymousAccessOptions,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Ensure the request is intended for the GraphQL API endpoint
    if (req.path === "/shop-api" || req.baseUrl === "/shop-api") {
      const body = req.body;
      if (body && body.query) {
        const operationName = this.getOperationName(body.query);
        if (!operationName) {
          throw new InternalServerError(
            "Operation name not found or extracted",
          );
        }
        if (this.isPublicOperation(operationName)) {
          return next();
        }
      }

      const isLoggedIn = await this.isLoggedIn(req);
      if (!isLoggedIn) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    next();
  }

  private getOperationName(query: string): string | undefined {
    try {
      const document = parse(query) as DocumentNode;
      const operationAST = getOperationAST(document) as OperationDefinitionNode;
      return operationAST?.name?.value;
    } catch (error) {
      Logger.error(`Error parsing GraphQL query: ${error}`);
      return undefined;
    }
  }

  private isPublicOperation(operationName: string): boolean {
    return this.options.allowedMethods.includes(operationName);
  }

  private async isLoggedIn(req: Request): Promise<boolean> {
    const session = await this.getSession(req);
    return !!session?.user;
  }

  private async getSession(req: Request): Promise<CachedSession | undefined> {
    const { tokenMethod } = this.configService.authOptions;
    const sessionToken = extractSessionToken(req, tokenMethod);
    return sessionToken
      ? await this.sessionService.getSessionFromToken(sessionToken)
      : undefined;
  }
}
