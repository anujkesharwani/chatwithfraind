import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideFirebaseApp,  initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from './environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {getMessaging, provideMessaging } from '@angular/fire/messaging';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    importProvidersFrom([
      provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
      provideFirestore(()=>getFirestore()),
      provideAuth(() => getAuth()),
      provideStorage(() => getStorage()),
      provideMessaging(() =>  getMessaging()),

    ])

  ]
};
