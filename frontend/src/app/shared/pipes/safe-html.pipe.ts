import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) { }
  transform(html): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }

}
