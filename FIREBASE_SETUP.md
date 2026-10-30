# Firebase setup — Creation Studio v1.2
Cloud authentication and Firestore require your own Firebase project; no credentials are included in the repository.

1. In Firebase Console, create/select a project, register a Web app and create Cloud Firestore.
2. Enable Authentication → Sign-in method → Google and GitHub. For GitHub, create an OAuth App in GitHub Developer Settings and paste the client ID/secret into the Firebase provider configuration. Use Firebase's exact OAuth callback URL (shown in its GitHub provider setup).
3. Configure authorized domains for the deployed GitHub Pages hostname. **GitHub Pages + Firebase redirect auth can require a custom auth domain/proxy or a popup flow**; verify on the deployed domain and on mobile browsers.
4. Copy `.env.example` to `.env.local`, fill Firebase web config. These identifiers are public configuration, not secrets; never place GitHub OAuth client secret or Firebase service-account key in Vite env.
5. Deploy `firestore.rules` using Firebase CLI: `firebase deploy --only firestore:rules` after reviewing and configuring firebase.json in your Firebase project. Test rules with the emulator first.
6. Build and deploy the app. Signed-in saves are stored at `users/{uid}/saves/main`. The current implementation uses manual sync/restore; do not assume cross-device conflict resolution is automatic.
7. For secure production usage, enable App Check if appropriate, configure quotas and test two devices, offline usage, guest upgrade, sign-out and account switching.

Known limitations: login cannot function until these setup steps are complete. Guest play and IndexedDB saves work without Firebase.
