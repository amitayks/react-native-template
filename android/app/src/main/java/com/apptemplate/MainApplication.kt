/* AI-INSTRUCTION-START:android-package-name-application
 * Android Package Name Configuration
 *
 * CRITICAL CUSTOMIZATION REQUIRED:
 * 1. Replace 'com.apptemplate' with your app's package name (e.g., 'com.mycompany.myapp')
 * 2. Replace 'com.apptemplate.MemoryPackage' import with your package name
 * 3. This must match the package name in MainActivity.kt
 *
 * Example: If your package is 'com.mycompany.myapp':
 *   - package com.mycompany.myapp
 *   - import com.mycompany.myapp.MemoryPackage
 *
 * AI-INSTRUCTION-END */
package com.apptemplate

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.apptemplate.MemoryPackage

/* AI-INSTRUCTION-START:native-modules
 * Native module registration
 *
 * CUSTOMIZATION:
 * Add your custom native modules here
 * Example:
 * import com.yourapp.YourNativePackage
 * ...
 * add(YourNativePackage())
 *
 * AI-INSTRUCTION-END */

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
              add(MemoryPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
