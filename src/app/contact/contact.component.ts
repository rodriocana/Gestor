import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true, // Asegúrate de declarar el componente como standalone
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  images: string[] = [
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgn5HnUUyZuMrKzzY7lu2z4gzxC3XVR4gU7S0wiy4BoilckTYBIodRWK86NT4hHVlspmD6UZhyRkCCwkd_Rexzls8lJMFn7N71updEvfLk84Gf5TuKR-ijvxjbK8HWPBvvNepuOzkhtOdoF/s1600/.....-................................................png',

  ];

  isSmall: boolean = false;

  contactForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    message: new FormControl('')
  });

  constructor() { }

  ngOnInit() {
  }


onSubmit() {
  console.log(this.contactForm.value);
  }

  addImage() {

    this.images.push('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgn5HnUUyZuMrKzzY7lu2z4gzxC3XVR4gU7S0wiy4BoilckTYBIodRWK86NT4hHVlspmD6UZhyRkCCwkd_Rexzls8lJMFn7N71updEvfLk84Gf5TuKR-ijvxjbK8HWPBvvNepuOzkhtOdoF/s1600/.....-................................................png');
    console.log(this.images);

    }

    deleteimage() {
      this.images.pop();
      }

      smallImage() {
        // Alterna el estado de `isSmall`
        this.isSmall = !this.isSmall;
      }

}
