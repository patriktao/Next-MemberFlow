rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  match /{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
    match /members/{uid} {
      allow read: if request.auth.uid == uid;

      match /checkout_sessions/{id} {
        allow read, write: if request.auth.uid == uid;
      }
      match /subscriptions/{id} {
        allow read: if request.auth.uid == uid;
      }
      match /payments/{id} {
        allow read: if request.auth.uid == uid;
      }
    }

    match /memberships/{id} {
      allow read: if true;

      match /prices/{id} {
        allow read: if true;
      }

      match /tax_rates/{id} {
        allow read: if true;
      }
    }
    
    match /members/{uid} {
    	allow read, write: if request.auth.uid == uid || request.auth.token.admin == true;
    }
  }
}