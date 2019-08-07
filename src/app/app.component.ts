import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  entryForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.entryForm = new FormGroup({
      email: new FormControl(''),
      twitchName: new FormControl(''),
      youtubeName: new FormControl(''),
      code: new FormControl('')
    });
  }

  onSubmit(data) {
    console.log(data);
  }
}
