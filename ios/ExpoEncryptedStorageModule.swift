import ExpoModulesCore
import Security

public class ExpoEncryptedStorageModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoEncryptedStorage')` in JavaScript.
    Name("ExpoEncryptedStorage")
      
    AsyncFunction("setItemAsync") { (key:String, value: String, promise: Promise) in
        // Prepares the insert query structure
        let storeQuery = [
          kSecClass       : kSecClassGenericPassword,
          kSecAttrAccount : key,
          kSecValueData   : value.data(using: String.Encoding.utf8)!
        ] as CFDictionary

        // Deletes the existing item prior to inserting the new one
        SecItemDelete(storeQuery)

        let status = SecItemAdd(storeQuery, nil)
         
        if (status == noErr) {
            promise.resolve(value);
        } else {
            let message = SecCopyErrorMessageString(status,nil)! as String
            promise.reject(String(status), message)
        }
    }
      
    AsyncFunction("getItemAsync") { (key:String, promise: Promise) in
        // Prepares the get query structure
        let query = [
            kSecClass       : kSecClassGenericPassword,
            kSecAttrAccount : key,
            kSecReturnData   : kCFBooleanTrue as Any,
            kSecMatchLimit  : kSecMatchLimitOne
        ] as CFDictionary

        var dataTypeRef: AnyObject?

        let status = SecItemCopyMatching(query, &dataTypeRef);

        if status == noErr && dataTypeRef != nil
        {
            promise.resolve(String(data: dataTypeRef as! Data, encoding: .utf8))
        } else {
            let message = SecCopyErrorMessageString(status,nil)! as String
            promise.reject(String(status), message)
        }
    }
      
    AsyncFunction("removeItemAsync") { (key:String, promise: Promise) in
        // Prepares the remove query structure
        let query = [
            kSecClass       : kSecClassGenericPassword,
            kSecAttrAccount : key,
            kSecReturnData   : kCFBooleanTrue as Any
        ] as CFDictionary

        let status = SecItemDelete(query);

        if status == noErr
        {
            promise.resolve(key)
        } else {
            let message = SecCopyErrorMessageString(status,nil)! as String
            promise.reject(String(status), message)
        }
    }

    AsyncFunction("clearAsync") { (promise: Promise) in
        let secItemClasses = [
            kSecClassGenericPassword,
            kSecClassInternetPassword,
            kSecClassCertificate,
            kSecClassKey,
            kSecClassIdentity
        ]

        for secItemClass in secItemClasses {
            let spec = [kSecClass as String: secItemClass] as CFDictionary
            SecItemDelete(spec)
        }

        promise.resolve(nil)
    }
  }
}
