import { Component } from '@angular/core';
import {FireService} from "./fire.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  email: string;
  password: string;

  content: string;
  constructor(public fireService: FireService) {
    this.email = "";
    this.password = "";

    this.content = ""
  }
}
