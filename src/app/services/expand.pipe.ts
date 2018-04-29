import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'expandPipe',
    // pure: false
  })
  export class ExpandPipe implements PipeTransform {
    transform(value: any, args?: any): any {
      return value.filter( item => {
        return item.isExpanded == true
      })
    }
  }