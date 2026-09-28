# Build & Release

## Prerequisites

- Flutter SDK (stable channel)
- Android SDK (API 33+)
- Java 17+

## Debug Build

```bash
flutter run                    # Run on connected device
flutter run --release          # Run release mode on device
```

## Release APK

```bash
# Fat APK (all architectures)
flutter build apk --release

# Split per ABI (smaller downloads)
flutter build apk --split-per-abi --release
```

Output: `build/app/outputs/flutter-apk/app-release.apk`

## App Signing

1. Generate keystore:
   ```bash
   keytool -genkey -v -keystore pokedex-nexus.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias pokedex_nexus
   ```

2. Create `android/key.properties`:
   ```properties
   storePassword=<password>
   keyPassword=<password>
   keyAlias=pokedex_nexus
   storeFile=../../pokedex-nexus.jks
   ```

3. Reference in `android/app/build.gradle` — signing config block.

> **Never commit** `key.properties` or `.jks` files. Add them to `.gitignore`.

## App Bundle (Play Store)

```bash
flutter build appbundle --release
```

Output: `build/app/outputs/bundle/release/app-release.aab`
