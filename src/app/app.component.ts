import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { FirebaseService } from './service/firebase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatMenuModule,
    
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[FirebaseService]
})
export class AppComponent {
  title = 'firechat';

  constructor(private fireService:FirebaseService){}
  
  ngOnInit():void{
  } 
  
}
