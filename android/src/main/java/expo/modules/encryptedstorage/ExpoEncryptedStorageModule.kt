package expo.modules.encryptedstorage

import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import expo.modules.kotlin.Promise

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoEncryptedStorageModule : Module() {
    private val SHARED_PREFERENCES_FILENAME = "RN_ENCRYPTED_STORAGE_SHARED_PREF"

    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoEncryptedStorage')` in JavaScript.
        Name("ExpoEncryptedStorage")

        AsyncFunction("setItemAsync") { key: String, value: String, promise: Promise ->
            val editor: SharedPreferences.Editor = getPreferences().edit()
            editor.putString(key, value)
            val saved = editor.commit()

            // return@AsyncFunction value
            if (saved) {
                promise.resolve(key)
            } else {
                promise.reject("500", String.format("An error occurred while removing %s", key), null)
            }
        }

        AsyncFunction("getItemAsync") { key: String ->
            val value: String? = getPreferences().getString(key, null)

            return@AsyncFunction value
        }

        AsyncFunction("removeItemAsync") { key: String, promise: Promise ->
            val editor: SharedPreferences.Editor = getPreferences().edit()
            editor.remove(key)
            val saved = editor.commit()

            // return@AsyncFunction key
            if (saved) {
                promise.resolve(key)
            } else {
                promise.reject("500", String.format("An error occurred while removing %s", key), null)
            }
        }

        AsyncFunction("clearAsync") { promise: Promise ->
            val editor: SharedPreferences.Editor = getPreferences().edit()
            editor.clear()
            val saved = editor.commit()

            // return@AsyncFunction null
            if (saved) {
                promise.resolve(null)
            } else {
                promise.reject("500", "An error occurred while clearing SharedPreferences", null)
            }
        }
    }

    private val context
        get() = requireNotNull(appContext.reactContext)

    private val key
        get() = MasterKey.Builder(context)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .build();

    private fun getPreferences(): SharedPreferences {
        return EncryptedSharedPreferences.create(
                context,
                this.SHARED_PREFERENCES_FILENAME,
                key,
                EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    }
}
