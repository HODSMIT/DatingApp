import { Component, inject, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds } from '../../../app/types/user';
import { AccountService } from '../../../Core/service/account-service';
import { TextInput } from "../../../Shared/text-input/text-input";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  
  private accountService = inject(AccountService);
  private router = inject(Router)
   cancelregister = output<boolean>();
 protected cred = {} as RegisterCreds;

 private fb = inject(FormBuilder)

 protected credentialsForm: FormGroup;

 protected profileForm :  FormGroup;

 protected currentStep = signal(1);

 protected ValidationErrors = signal<string[]>([]);


 constructor()
 {
    this.credentialsForm = this.fb.group({
      email: ['johndoe@test.com',[Validators.required,Validators.email]],
      displayName : ['',Validators.required],
      password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required,this.matchValue('password')]]
    });


    this.profileForm = this.fb.group({
      gender: ['male',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      Country: ['',Validators.required]
    })
    this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
    })
 }
 

  matchValue(matchTo:string) : ValidatorFn
  {
      return (control : AbstractControl): ValidationErrors | null => {
        const parent = control.parent;
        if(!parent)
        {
          return null;
        }
        const matchValue = parent.get(matchTo)?.value
        return control.value == matchValue ? null : {passwordMismatch : true}

      }
  }

  nextStep(){
    if(this.credentialsForm.valid){
      this.currentStep.update(prevStep => prevStep + 1)

    }

    
  }
  prevStep(){
    
      this.currentStep.update(prevStep => prevStep - 1)
    }
  getMaxDate(){
    const today = new Date();
    today.setFullYear(today.getFullYear())
    return today.toISOString().split('T')[0];
  }
 register()
 {
   //console.log(this.cred);
   if(this.profileForm.valid && this.credentialsForm.valid)
   {
    const formData = {...this.credentialsForm.value,...this.profileForm.value};
    //console.log('Form Data:', formData);
      this.accountService.register(formData).subscribe({
    next: () => {
      //console.log(response);
      this.router.navigateByUrl('/Members');
      //this.cancel();
    },
    error: (error) => {
      console.log(error);
      this.ValidationErrors.set(error)
    }
  });


   }

 }

 cancel()
 {
  this.cancelregister.emit(false);
  console.log('cancelled!');
 }
}
