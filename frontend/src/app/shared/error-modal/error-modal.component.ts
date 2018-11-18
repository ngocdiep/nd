import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit() {
  }

  public close() {
    this.modalService.destroy();
  }

}
