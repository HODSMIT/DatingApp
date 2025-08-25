import { Component, input, output, signal } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class ImageUpload {
  protected imageSrc= signal<string | ArrayBuffer | null | undefined>(null);
  protected isDragging = false;
  private fileUpload: File | null = null;
  uploadFile = output<File>();
  loading = input<boolean>(false);


  OnDragOver(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;

  }

  OnDragLeave(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;

  }

  OnDrop(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;

    if(event.dataTransfer?.files.length){
      const file = event.dataTransfer.files[0];
      this.previewImage(file);
      this.fileUpload = file;
    }

  }

  private previewImage(file:File)
  {
    const reader  = new FileReader();
    reader.onload = (e) => this.imageSrc.set(e.target?.result);
    reader.readAsDataURL(file);
  }

  OnCancel(){
    this.fileUpload = null;
    this.imageSrc.set(null);
  }

  OnUpload(){
    if(this.fileUpload){
    this.uploadFile.emit(this.fileUpload);
    }
  }

}
