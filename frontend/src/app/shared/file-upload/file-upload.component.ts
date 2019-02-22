import { Component, EventEmitter, Output } from '@angular/core';
import { FileUploadService } from './file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  @Output()
  filePathUploaded = new EventEmitter();

  constructor(private fileUploadService: FileUploadService) {}

  onChange(evt) {
    const { files, validity } = evt.target;
    if (validity.valid) {
      this.upload(files);
    }
  }

  private upload(files: FileList) {
    this.fileUploadService.upload(files).subscribe(
      data => {
        this.filePathUploaded.emit(data);
      },
      err => console.log(err)
    );
  }

}
