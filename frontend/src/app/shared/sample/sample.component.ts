import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';


@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit() {
  }

  public close() {
    this.modalService.destroy();
  }
}
