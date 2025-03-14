import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { GameComponent } from './game/game.component';
import { ResultsComponent } from './results/results.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { GameBannerComponent } from './components/game-banner/game-banner.component';

// Pipes
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [
    GameComponent,
    ResultsComponent,
    LoadingSpinnerComponent,
    GameBannerComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    GameComponent,
    ResultsComponent,
    LoadingSpinnerComponent,
    GameBannerComponent,
    SafeHtmlPipe
  ]
})
export class SharedModule { }