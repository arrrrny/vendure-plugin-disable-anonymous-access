import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";

import { DISABLE_ANONYMOUS_ACCESS_PLUGIN_OPTIONS } from "./constants";
import { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { DisableAnonymousAccessMiddleware } from "./api/middleware";
import { DisableAnonymousAccessOptions } from "./types";
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [
    {
      provide: DISABLE_ANONYMOUS_ACCESS_PLUGIN_OPTIONS,
      useFactory: () => DisableAnonymousAccessPlugin.options,
    },
  ],
  configuration: (config) => {
    // Plugin-specific configuration
    // such as custom fields, custom permissions,
    // strategies etc. can be configured here by
    // modifying the `config` object.
    return config;
  },
  compatibility: ">=2.0.0",
})
export class DisableAnonymousAccessPlugin implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DisableAnonymousAccessMiddleware).forRoutes("shop-api");
  }
  static options: DisableAnonymousAccessOptions;

  static init(
    options: DisableAnonymousAccessOptions,
  ): Type<DisableAnonymousAccessPlugin> {
    this.options = options;
    return DisableAnonymousAccessPlugin;
  }
}
