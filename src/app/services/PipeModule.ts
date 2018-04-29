import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import { ThumbnailPipe } from '../services/thumbnail.pipe'
import { ExpandPipe } from '../services/expand.pipe'

@NgModule({
  declarations:[ThumbnailPipe,ExpandPipe],
  imports:[CommonModule],
  exports:[ThumbnailPipe,ExpandPipe]
})
export class PipeModule{}