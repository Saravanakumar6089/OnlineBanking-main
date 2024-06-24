import { Component, OnInit } from '@angular/core';
import { CustomerImpl } from '../model/customer.model'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  constructor() { }
  
  ngOnInit(): void {
    
  }
  onClickSubmit(data: any) {
    alert("Entered Email id : " + data.emailid + data.passwd);
    } 
  
}
