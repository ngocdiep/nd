import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { SampleComponent } from 'src/app/shared/sample/sample.component';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isEmailExisted = false;
  errors: string[] = [];
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordRepeat: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.resetStatus();
    if (!this.validate()) {
      return;
    }
    this.authService.registerPersonAndSignIn(this.registerForm.value).subscribe(
      result => {
        if (!result.errors) {
          this.router.navigateByUrl('');
        } else {
          (<Array<any>>result.errors).map(err => {
            if (err.code === '23505') {
              this.isEmailExisted = true;
            } else {
              this.errors.push(err.message);
            }
          });
        }
      },
      err => {
        console.log(err);
      });
  }

  resetStatus() {
    this.isEmailExisted = false;
    this.errors = [];
  }

  validate() {
    if (this.registerForm.value.password !== this.registerForm.value.passwordRepeat) {
      this.errors.push('Password does not match the confirm password.');
    }

    return this.errors.length === 0;
  }

  hasError() {
    return this.isEmailExisted || this.errors.length > 0;
  }

  onShowInfo() {
    console.log('s');
  }

  initLoginModal() {
    const inputs = {
      isMobile: false
    };

    this.modalService.init(SampleComponent, inputs, {});
  }
}
