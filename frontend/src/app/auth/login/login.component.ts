import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

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
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authService.clearAuth();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.resetStatus();
    this.authService.authenticate(this.loginForm.value).subscribe(
      result => {
        if (result.data.authenticate.jwtToken) {
          this.router.navigateByUrl('');
        } else {
          this.errors.push('Email or password is incorrect.');
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
