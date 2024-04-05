import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../service/firebase.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  providers:[FirebaseService],

})
export class ChatComponent {
addEmoji(arg0: string) {
throw new Error('Method not implemented.');
}
  
  chatService = inject(FirebaseService);

  user: { name: any, profile: string } ={
    name: "User Name",
    profile:"assets/profile.png"
  }

  messages$ = this.chatService.loadMessages() as Observable<DocumentData[]>;


  
  isVisible = false;
  toggleDiv() {
    this.isVisible = !this.isVisible;
  }

  userName:any|undefined
  ngOnInit():void{
    this.chatService.user$.subscribe((userData: any | null) => {
      if (userData) {
        this.user.name = userData.displayName;
        this.user.profile=userData?.photoURL;
        console.log(userData.photoURL)
      } 
    });  
    console.log(this.messages$)
  
  }


    text = '';
    imgFile:any
    sendTextMessage() {
      this.chatService.saveTextMessage(this.text);
      this.text = '';
      if(this.imgFile){
      this.chatService.saveImageMessage(this.imgFile);
      }
      else{ return
      }
    }

    uploadImage(event: any) {
      this.imgFile= event.target.files[0];
      if (!this.imgFile) {
        return;
      }
    }
}
