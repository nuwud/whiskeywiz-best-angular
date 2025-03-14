import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  returnUrl: string = '/';
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  
  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  
  async onSubmit() {
    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    try {
      await this.authService.login(
        this.f['email'].value,
        this.f['password'].value
      );
      this.router.navigate([this.returnUrl]);
    } catch (error: any) {
      this.error = error.message || 'An error occurred during login';
    } finally {
      this.loading = false;
    }
  }
}