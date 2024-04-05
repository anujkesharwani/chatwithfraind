import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, CollectionReference, DocumentData, DocumentReference, addDoc, serverTimestamp, query, orderBy, limit, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';
import { Auth, signOut, user } from '@angular/fire/auth';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  private storage: Storage = inject(Storage);

  user$ = user(this.auth);

  ngOnInit() {
  }

  constructor(private router: Router) { }

  userName: any

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log(user)
        this.router.navigate(['/', 'chat']);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/'])
      console.log('signed out');
    }).catch((error) => {
      console.log('sign out error: ' + error);
    })
  }


  // Adds a text or image message to Cloud Firestore.
  addMessage = async (textMessage: string | null, imageUrl: string | null): Promise<void | DocumentReference<DocumentData>> => {
    let data: any;
    console.log("work")
    try {
      this.user$.subscribe(async (user) => {
        if (textMessage && textMessage.length > 0) {
          data = await addDoc(collection(this.firestore, 'messages'), {
            name: user?.displayName,
            text: textMessage,
            profilePicUrl: user?.photoURL,
            timestamp: serverTimestamp(),
            uid: user?.uid
          })
        }
        else if (imageUrl && imageUrl.length > 0) {
          data = await addDoc(collection(this.firestore, 'messages'), {
            name: user?.displayName,
            imageUrl: imageUrl,
            profilePicUrl: user?.photoURL,
            timestamp: serverTimestamp(),
            uid: user?.uid
          });
        }

        return data;
      }
      );
    }
    catch (error) {
      console.error('Error writing new message to Firebase Database', error);
      return;
    }
  }

  // Saves a new message to Cloud Firestore.
  saveTextMessage = async (messageText: string) => {
    this.addMessage(messageText, null)
    return null;
  };

  loadMessages = () => {
    const recentMessagesQuery = query(collection(this.firestore, 'messages'), orderBy('timestamp', 'desc'), limit(12));
    return collectionData(recentMessagesQuery);
  }

  LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

  saveImageMessage = async (file: any) => {
    try {
      // 1 - You add a message with a loading icon that will get updated with the shared image.

      // 2 - Upload the image to Cloud Storage.
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format
      const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, ''); // Get HHMMSS format

      const filePath = `${this.auth.currentUser?.uid}/${formattedDate}_${formattedTime}_${file.name}`;
      const newImageRef = ref(this.storage, filePath);
      const fileSnapshot = await uploadBytesResumable(newImageRef, file);

      // 3 - Generate a public URL for the file.
      const publicImageUrl = await getDownloadURL(newImageRef);
      const messageRef = await this.addMessage(null, publicImageUrl);

      // 4 - Update the chat message placeholder with the image's URL.
      messageRef ?
        await updateDoc(messageRef, {
          imageUrl: publicImageUrl,
          storageUri: fileSnapshot.metadata.fullPath
        }) : null;
    } catch (error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    }
  }

  async uploadToStorage(
    path: string,
    input: HTMLInputElement,
    contentType: any
  ) {
    return null;
  }

}
