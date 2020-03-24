import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TagService } from 'src/app/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  tagsLoaded = false;
  @Input() form: FormGroup;
  allTags: { id: number, name: string }[];
  autocompleteItems: string[];
  @Output() tagSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private tagService: TagService,
  ) { }

  ngOnInit() {
    this.tagService.filter().pipe(finalize(() => this.tagsLoaded = true)).subscribe(result => {
      this.allTags = result.data['allTags']['nodes'];
      this.autocompleteItems = this.allTags.map(tag => tag.name);
    });
  }

  // TODO: use in future when too much tags
  /* public requestAutocompleteTags = (pattern: string): Observable<Response> => {
    return this.tagService.filter(pattern).pipe(map(
      result => {
        return result.data['allTags'].nodes.map(tag => tag.name);
      }));
  } */

  onSelect(name: string) {
    this.tagSelected.emit(name);
  }
}
