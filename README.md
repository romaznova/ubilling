# Generating Signed APK
Android requires that all apps be digitally signed with a certificate before they can be installed, so to distribute your Android application via [Google Play](https://play.google.com/store) store, you'll need to generate a signed release APK. The [Signing Your Applications](https://developer.android.com/tools/publishing/app-signing.html) page on Android Developers documentation describes the topic in detail. This guide covers the process in brief, as well as lists the steps required to package the JavaScript bundle.

**Generating a signing key** <br />
You can generate a private signing key using keytool. On Windows keytool must be run from 
C:\Program Files\Java\jdkx.x.x_x\bin.
```
$ keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```
This command prompts you for passwords for the keystore and key and for the Distinguished Name fields for your key. It then generates the keystore as a file called `my-release-key.keystore`.

The keystore contains a single key, valid for 10000 days. The alias is a name that you will use later when signing your app, so remember to take note of the alias.

On Mac, if you're not sure where your jdk bin folder is, then perform the following command to find it:
```
$ /usr/libexec/java_home
```
It will output the directory of the jdk, which will look something like this:
```
/Library/Java/JavaVirtualMachines/jdkX.X.X_XXX.jdk/Contents/Home
```
Navigate to that directory by using the command $ cd /your/jdk/path and use the keytool command with sudo permission as shown below.
```
$ sudo keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```
**Note:** <br/> 
> Remember to keep your keystore file private and never commit it to version control.

Setting up gradle variables
Place the my-release-key.keystore file under the android/app directory in your project folder.
Edit the file ~/.gradle/gradle.properties or android/gradle.properties, and add the following (replace ***** with the correct keystore password, alias and key password),
```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```
These are going to be global gradle variables, which we can later use in our gradle config to sign our app.

**Note about saving the keystore:**

> Once you publish the app on the Play Store, you will need to republish your app under a different package name (losing all downloads and ratings) if you want to change the signing key at any point. So backup your keystore and don't forget the passwords.

**Note about security:** <br/> 
> If you are not keen on storing your passwords in plaintext, and you are running OSX, you can also [store your credentials in the Keychain Access app](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/). Then you can skip the two last rows in `~/.gradle/gradle.properties`.

Adding signing config to your app's gradle config
Edit the file android/app/build.gradle in your project folder, and add the signing config,
```
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```
**Generating the release APK** <br/>
Simply run the following in a terminal:
```
$ cd android
$ ./gradlew assembleRelease
```
Gradle's assembleRelease will bundle all the JavaScript needed to run your app into the APK. If you need to change the way the JavaScript bundle and/or drawable resources are bundled (e.g. if you changed the default file/folder names or the general structure of the project), have a look at `android/app/build.gradle` to see how you can update it to reflect these changes.

**Note:** <br/> 
> Make sure gradle.properties does not include org.gradle.configureondemand=true as that will make the release build skip bundling JS and assets into the APK.

The generated APK can be found under `android/app/build/outputs/apk/release/app-release.apk`, and is ready to be distributed.

Testing the release build of your app
Before uploading the release build to the Play Store, make sure you test it thoroughly. First uninstall any previous version of the app you already have installed. Install it on the device using:
```
$ react-native run-android --variant=release
```
Note that `--variant=release` is only available if you've set up signing as described above.

You can kill any running packager instances, since all your framework and JavaScript code is bundled in the APK's assets.
