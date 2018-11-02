import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { UserService } from '../shared/user.service';
import { SampleComponent } from 'src/app/shared/sample/sample.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  errors: string[];
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
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
    console.log(this.registerForm);
    this.userService.registerPersonAndSignIn(this.registerForm.value).subscribe(
      result => {
        if (!result.errors) {
          this.router.navigateByUrl('');
        } else {
          this.errors = (<Array<any>>result.errors).map(e => {
            return e.message;
          });
        }
      },
      err => {
        console.log(err);
      });
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
