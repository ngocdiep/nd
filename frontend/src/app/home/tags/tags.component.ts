import { Component, OnInit, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { TagService } from 'src/app/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  @Input() selectedTag: string;
  tagsLoaded = false;
  allTags: { id: number, name: string }[];

  constructor(
    private tagService: TagService,
  ) { }

  ngOnInit() {
    this.tagService.filter().pipe(finalize(() => this.tagsLoaded = true)).subscribe(result => {
      this.allTags = result.data['allTags']['nodes'];
    });
  }

}
