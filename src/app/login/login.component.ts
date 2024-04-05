import { Component, inject } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[FirebaseService],
})
export class LoginComponent {

  chatService = inject(FirebaseService);
  
  ngOnInit():void{
    console.log("work")
  }

}
