import { Component, Input, signal } from '@angular/core';
import { Register } from "../account/register/register";
import { User } from '../../app/types/user';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

protected registermode = signal(false); 

showRegister(value: boolean)
{
   this.registermode.set(value);
}
}
