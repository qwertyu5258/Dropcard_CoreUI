import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thumbnailPipe',
  // pure: false
})
export class ThumbnailPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.filter( item => {
      return item.isExpanded == false
    })
  }
}