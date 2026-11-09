import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRolStyle]',
  standalone: true
})
export class RolStyleDirective implements OnInit {
  @Input('appRolStyle') rol: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.rol === 'admin' || this.rol === 'administrador') {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#fee2e2'); // Rojo suave
      this.renderer.setStyle(this.el.nativeElement, 'color', '#991b1b'); // Texto rojo oscuro
      this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#e0f2fe'); // Celeste suave
      this.renderer.setStyle(this.el.nativeElement, 'color', '#0369a1'); // Texto azul oscuro
    }
  }
}