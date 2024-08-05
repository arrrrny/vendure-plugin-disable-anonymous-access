# Vendure Plugin: Disable Anonymous Access

This plugin allows you to disable anonymous access to your Vendure e-commerce store. By requiring users to authenticate before accessing any content, you can enhance security and control access to your store.


## Configuration

To configure the plugin, open your Vendure project's `vendure-config.ts` file and add the following code:

```typescript
import { DisableAnonymousAccessPlugin } from 'vendure-plugin-disable-anonymous-access';

export const config: VendureConfig = {
  // ... other config options
  plugins: [
    // ... other plugins
    DisableAnonymousAccessPlugin.int({
      allowedMethods:["FirebaseAuth"]
    }),
  ],
};
```

## Usage

Once the plugin is installed and configured, anonymous access will be disabled. Users will be required to authenticate before accessing any content on your Vendure store. 

We still need to allow some methods like authenticate.  This plugin extracts the graphql method name and checks if the method is within the allowed method defined in the options and allow that method to pass by without authentication. In the below, this is the body sent and since FirebaseAuth method is allowed, it bypasses.
```
body {
  operationName: null,
  variables: {
    uid: 'OWT6nismkIXDrqdZzCK5XXXXXXXXX',
    jwt: 'token'
  },
  query: 'mutation FirebaseAuth($uid: String!, $jwt: String!) {\n' +
    '  __typename\n' +
    '  authenticate(input: {firebase: {uid: $uid, jwt: $jwt}}) {\n' +
    '    __typename\n' +
    '  }\n' +
    '}'
}
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the [GitHub repository](https://github.com/arrrrny/vendure-plugin-disable-anonymous-access).

