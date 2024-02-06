# React Native Expo Encrypted Storage

Expo wrapper to [React Native Encrypted Storage](https://github.com/emeraldsanto/react-native-encrypted-storage).

## Installation

### Via `yarn`

```bash
$ yarn add expo-encrypted-storage
```

### Via `npm`

```bash
$ npm install expo-encrypted-storage
```

## Linking

- React Native 0.60+

Since version 0.60, React Native supports auto linking. This means no additional step is needed on your end.

- React Native <= 0.59

```bash
$ react-native link expo-encrypted-storage
```

Special note for iOS using `cocoapods`, run:

```bash
$ npx pod-install
```

## Usage

This module exposes four (4) native functions to store, retrieve, remove and clear values. They can be used like so:

### Import

```js
import ExpoEncryptedStorage from "expo-encrypted-storage";
```

### Storing a value

```js
async function storeUserSession() {
  try {
    await ExpoEncryptedStorage.setItem(
      "user_session",
      JSON.stringify({
        age: 21,
        token: "ACCESS_TOKEN",
        username: "emeraldsanto",
        languages: ["fr", "en", "de"],
      })
    );

    // Congrats! You've just stored your first value!
  } catch (error) {
    // There was an error on the native side
  }
}
```

### Retrieving a value

```js
async function retrieveUserSession() {
  try {
    const session = await ExpoEncryptedStorage.getItem("user_session");

    if (session !== undefined) {
      // Congrats! You've just retrieved your first value!
    }
  } catch (error) {
    // There was an error on the native side
  }
}
```

### Removing a value

```js
async function removeUserSession() {
  try {
    await ExpoEncryptedStorage.removeItem("user_session");
    // Congrats! You've just removed your first value!
  } catch (error) {
    // There was an error on the native side
  }
}
```

### Clearing all previously saved values

```js
async function clearStorage() {
  try {
    await ExpoEncryptedStorage.clear();
    // Congrats! You've just cleared the device storage!
  } catch (error) {
    // There was an error on the native side
  }
}
```

### Error handling

Take the `removeItem` example, an error can occur when trying to remove a value which does not exist, or for any other reason. This module forwards the native iOS Security framework error codes to help with debugging.

```js
async function removeUserSession() {
  try {
    await ExpoEncryptedStorage.removeItem("user_session");
  } catch (error) {
    // There was an error on the native side
    // You can find out more about this error by using the `error.code` property
    console.log(error.code); // ex: -25300 (errSecItemNotFound)
  }
}
```

## Note regarding `Keychain` persistence

You'll notice that the iOS `Keychain` is not cleared when your app is uninstalled, this is the expected behaviour. However, if you do want to achieve a different behaviour, you can use the below snippet to clear the `Keychain` on the first launch of your app.

```objc
// AppDelegate.m

/**
 Deletes all Keychain items accessible by this app if this is the first time the user launches the app
 */
static void ClearKeychainIfNecessary() {
    // Checks wether or not this is the first time the app is run
    if ([[NSUserDefaults standardUserDefaults] boolForKey:@"HAS_RUN_BEFORE"] == NO) {
        // Set the appropriate value so we don't clear next time the app is launched
        [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"HAS_RUN_BEFORE"];

        NSArray *secItemClasses = @[
            (__bridge id)kSecClassGenericPassword,
            (__bridge id)kSecClassInternetPassword,
            (__bridge id)kSecClassCertificate,
            (__bridge id)kSecClassKey,
            (__bridge id)kSecClassIdentity
        ];

        // Maps through all Keychain classes and deletes all items that match
        for (id secItemClass in secItemClasses) {
            NSDictionary *spec = @{(__bridge id)kSecClass: secItemClass};
            SecItemDelete((__bridge CFDictionaryRef)spec);
        }
    }
}

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Add this line to call the above function
    ClearKeychainIfNecessary();

    RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"APP_NAME" initialProperties:nil];

    rootView.backgroundColor = [UIColor colorWithRed:1.0f green:1.0f blue:1.0f alpha:1];

    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = rootView;

    self.window.rootViewController = rootViewController;
    [self.window makeKeyAndVisible];

    return YES;
}

// ...

@end
```

# Limitations

There seems to be some confusion around the maximum size of items that can be stored, especially on iOS. According to this [StackOverflow question](https://stackoverflow.com/questions/13488793/is-there-any-length-limit-of-string-stored-in-keychain), the actual Keychain limit is much lower than what it should theoretically be. This does not affect Android as the `EncryptedSharedPreferences` API relies on the phone's storage, via XML files.

## License

MIT