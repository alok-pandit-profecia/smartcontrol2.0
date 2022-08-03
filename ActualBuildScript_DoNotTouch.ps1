if((Test-Path -Path "./android/app/src/main/assets/index.android.*")) {

    Write-Host "Deleting main/assets";

    Remove-Item -Force ./android/app/src/main/assets/index.android.*;

}

if((Test-Path -Path "./android/app/build/intermediates/assets/debug/index.android.*")) {

    Write-Host "Deleting intermediates/assets/debug";

    Remove-Item -Force ./android/app/build/intermediates/assets/debug/index.android.*;

}

if((Test-Path -Path "./android/app/build/intermediates/assets/release/index.android.*")) {

    Write-Host "Deleting intermediates/assets/release";

    Remove-Item -Force ./android/app/build/intermediates/assets/release/index.android.*;

}

Write-Host "Creating Bundle";
react-native bundle --platform android --dev false --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res

Set-Location ./android;

Write-Host "Cleaning Gradle";
Write-Progress -Activity "Cleaning Gradle" -Status "Started";  
./gradlew clean;
Write-Progress -Activity "Cleaning Gradle" -Completed;

Write-Host "Delete Drawable folder";
Write-Progress -Activity "Delete drawable" -Status "Started";

if((Test-Path -Path "./app/src/main/res/drawable-*/*")) {

    Write-Host "Deleting drawable folder";

    Remove-Item -Force ./app/src/main/res/drawable-*/*;

}
if((Test-Path -Path "./app/src/main/res/drawable-mdpi/*")) {

    Write-Host "Deleting drawable folder";

    Remove-Item -Force ./app/src/main/res/drawable-mdpi/*;

}
if((Test-Path -Path "./app/src/main/res/drawable-xhdpi/*")) {

    Write-Host "Deleting drawable folder";

    Remove-Item -Force ./app/src/main/res/drawable-xhdpi/*;

}
if((Test-Path -Path "./app/src/main/res/drawable-xxhdpi/*")) {

    Write-Host "Deleting drawable folder";

    Remove-Item -Force ./app/src/main/res/drawable-xxhdpi/*;

}
if((Test-Path -Path "./app/src/main/res/drawable-xxxhdpi/*")) {

    Write-Host "Deleting drawable folder";

    Remove-Item -Force ./app/src/main/res/drawable-xxxhdpi/*;

}
if((Test-Path -Path "./app/src/main/res/raw/*")) {

    Write-Host "Deleting raw folder";

    Remove-Item -Force ./app/src/main/res/raw/*;

}
Write-Progress -Activity "Delete drawable" -Completed;

Start-Sleep 1;

Write-Host "Creating Release Build";
Write-Progress -Activity "Creating Release Build" -Status "Started";
./gradlew assembleRelease;
Write-Progress -Activity "Creating Release Build" -Completed;

Write-Host "Rename Build";
Write-Progress -Activity "Rename Build" -Status "Started";
if((Test-Path -Path "./app/build/outputs/apk/release/app-release.apk")) {

    Write-Host "Rename Build";
    Rename-Item  -Force -Path ./app/build/outputs/apk/release/app-release.apk -NewName "Smartcontrol.apk";

}
Write-Progress -Activity "Rename Build" -Completed;