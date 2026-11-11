import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-page',
  template: `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Verificando sesión, por favor espere...</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #f8fafc;
      color: #333;
      font-family: sans-serif;
    }
    .spinner {
      width: 45px;
      height: 45px;
      border: 4px solid #e2e8f0;
      border-top: 4px solid #2e7d32; /* Tu verde característico */
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 15px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingPageComponent {}