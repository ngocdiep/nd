import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errors: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.resetStatus();
    this.userService.authenticate(this.loginForm.value).subscribe(
      result => {
        if (!result.errors) {
          this.router.navigateByUrl('');
        } else {
          (<Array<any>>result.errors).map(err => {
            this.errors.push(err.message);
          });
        }
      },
      err => {
        console.log(err);
      });
  }

  resetStatus() {
    this.errors = [];
  }

  hasError() {
    return this.errors.length > 0;
  }

}
