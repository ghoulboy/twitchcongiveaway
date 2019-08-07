import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { defineBase } from '@angular/core/src/render3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  entryForm: FormGroup;
  relative: Observable<any[]>;
  twitchFollows: boolean;
  res: string;

  headers = new HttpHeaders().set('Client-Id', 'u92rpilefc2k38zaqvd61unkyczpzi')
  // .set('access-control-allow-origin', '*')

  constructor(private db: AngularFireDatabase, private http: HttpClient) {
    this.relative = db.list('qAzswe').valueChanges();
  }

  ngOnInit() {
    this.entryForm = new FormGroup({
      email: new FormControl('', Validators.required),
      twitchName: new FormControl('drxdesign', Validators.required),
      youtubeName: new FormControl(''),
      code: new FormControl('', Validators.required)
    });
  }

  test() {
    this.http.get("https://www.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&mine=true&key=AIzaSyAOkF9XZ6U7cxQR8GUNZCkX5xe6hSl9hL8&channelId=UCATWC1JSlhzmYeDbjnS8WwA").subscribe(x => console.log(x))
  }

  onSubmit(data) {
    //twitch follow validation
    this.http.get(`https://api.twitch.tv/helix/users?login=${data.twitchName}`, {headers: this.headers}).pipe(
      switchMap((x:any) => {
        if (x.data.length > 0) {
          const id = x.data[0].id
          return this.http.get(`https://api.twitch.tv/helix/users/follows?from_id=${id}&to_id=97835957`, {headers: this.headers})
        }       
        return of(1)
      })
    ).subscribe((x:any) => {
      if (x == 1) {
        this.res = "Could not find twitch name, please make sure it is spelled correctly."
      }     
    
      if (x.data.length == 0) {
        this.res = "You need to be following my twitch channel in order to enter the giveaway!!"
      }

      this.db.object(data.code).snapshotChanges().pipe(first()).subscribe((x:any) => {
        if(x.key && !x.payload.val().email) {
          this.db.object(data.code).update({
            email: data.email,
            twitchName: data.twitchName,
            youtubeName: data.youtubeName
          });
          this.res = "Entered successfully!! Good luck!"
        }

        if(x.key && x.payload.val().email) {
          this.res = "Code has already been claimed!"
        }

        if (!x.key) {
          this.res = "Invalid code make sure it is typed correctly and case sensitive!"
        }        
      });
    });
    // this.http.get("https://api.twitch.tv/helix/users/36712413/follows/channels/97835957", {headers: this.headers}).subscribe(x => console.log(x))

    //use this to get ID's my id: 97835957
    
  }
}
