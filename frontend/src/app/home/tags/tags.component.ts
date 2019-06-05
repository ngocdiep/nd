import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, map } from 'rxjs/operators';
import { TagService } from 'src/app/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  tagsLoaded = false;
  form: FormGroup;
  tags: { id: number, name: string }[];
  filteredTags = new Set<string>();
  @Output()
  tagsAdded = new EventEmitter<string[]>();

  constructor(
    private tagService: TagService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.tagService.filter().pipe(finalize(() => this.tagsLoaded = true)).subscribe(result => {
      this.tags = result.data['allTags']['nodes'];
    });

    this.form = this.formBuilder.group({
      tags: [[], [Validators.required]],
    });
  }

  public requestAutocompleteTags = (pattern: string): Observable<Response> => {
    return this.tagService.filter(pattern).pipe(map(
      result => {
        return result.data['allTags'].nodes.map(tag => tag.name);
      }));
  }

  onAdd($event: any) {
    this.filteredTags.add($event.value);
    this.tagsAdded.emit(Array.from(this.filteredTags));
  }

  onSelect(name: string) {
    if (this.filteredTags.has(name)) {
      return;
    }
    this.filteredTags.add(name);
    this.tagsAdded.emit(Array.from(this.filteredTags));
    this.form.get('tags').value.push({ display: name, value: name });
  }

  onRemove($event: any) {
    this.filteredTags.delete($event.value);
    this.tagsAdded.emit(Array.from(this.filteredTags));
  }

}
