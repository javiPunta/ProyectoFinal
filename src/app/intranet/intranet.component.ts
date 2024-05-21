import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.component.html',
  styleUrls: ['./intranet.component.scss']
})
export class IntranetComponent {
  constructor(
    private router: Router
  ){}
  goForm(event: Event) {
    event.preventDefault();
    this.router.navigate(['/intranet-conf']);
  }
  goGen(event: Event) {
    event.preventDefault();
    this.router.navigate(['/tabla']);
  }
  
}
