import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { PostList } from '../shared';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  @Input() postList: PostList;
  @Output() tagSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onTagSelected(tag: string) {
    this.tagSelected.emit(tag);
  }
}
