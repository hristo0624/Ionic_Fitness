import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss']
})
export class AddNoteComponent implements OnInit {

  @Input()
  public notes = '';

  constructor(public modalCtrl: ModalController) {
  }

  ngOnInit() {
  }

  public close() {
    this.modalCtrl.dismiss(null);
  }

  public closeWithNotes() {
    this.modalCtrl.dismiss(this.notes);
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.close();
  }
}
