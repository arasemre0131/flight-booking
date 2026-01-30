import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFormComponent } from '../../components/search-form/search-form.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, SearchFormComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {}
