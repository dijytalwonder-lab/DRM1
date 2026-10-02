# Damodara Ratna Mandir

Static web app (no build). Login -> Know Your Bracelet (DOB+time -> 5 bracelets) / Vastu Fix (tags -> 5-7 products).

Run locally: `node serve.js` then open http://localhost:5188

Host free on GitHub Pages: Settings -> Pages -> Deploy from branch main, / (root).

Android: Capacitor 6 wrapper in android/ (needs JDK 17). Rebuild: npx cap copy android, then cd android and run gradlew.bat assembleDebug. Web source is in www/.
