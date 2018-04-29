import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FavoriteComponent } from './favorite.component';
import { FavoriteRoutingModule } from './favorite-routing.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    FavoriteRoutingModule
  ],
  declarations: [ FavoriteComponent ]
})
export class FavoriteModule { }
