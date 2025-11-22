/* AI-INSTRUCTION-START:android-package-name
 * Android Package Name Configuration
 *
 * CRITICAL CUSTOMIZATION REQUIRED:
 * 1. Replace 'com.visara.app' with your app's package name
 * 2. Rename the directory structure from:
 *    android/app/src/main/java/com/visara/
 *    to match your package (e.g., android/app/src/main/java/com/mycompany/myapp/)
 * 3. Update AndroidManifest.xml package attribute
 * 4. Update build.gradle applicationId
 *
 * Example: If your package is 'com.mycompany.myapp':
 *   - package com.mycompany.myapp
 *   - Directory: android/app/src/main/java/com/mycompany/myapp/
 *
 * AI-INSTRUCTION-END */
package com.visara.app

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /* AI-INSTRUCTION-START:main-component-name
   * Main Component Name
   *
   * CRITICAL CUSTOMIZATION REQUIRED:
   * This MUST match the "name" field in app.json exactly
   * Change "AppTemplate" to your app's name (e.g., "MyApp")
   *
   * IMPORTANT: This must be a valid JavaScript identifier
   * (no spaces, no special characters)
   *
   * AI-INSTRUCTION-END */
  override fun getMainComponentName(): String = "AppTemplate"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
