import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../Core/service/member-service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../app/types/Member';
import { ImageUpload } from "../../../Shared/image-upload/image-upload";
import { AccountService } from '../../../Core/service/account-service';
import { User } from '../../../app/types/user';
import { StartButton } from "../../../Shared/start-button/start-button";
import { DeleteButton } from "../../../Shared/delete-button/delete-button";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StartButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit{

  protected memberservice = inject(MemberService) 
  private route = inject(ActivatedRoute)
  protected AccountService = inject(AccountService)


  protected photos = signal<Photo []>([]);

  protected loading = signal(false);
  ngOnInit(): void {
    const memberid = this.route.parent?.snapshot.paramMap.get('id');
    if (memberid)
    {
       this.memberservice.getMemberPhotos(memberid).subscribe({
        next : photos => this.photos.set(photos)
       }); 
    }
  }

  get photoMocks(){
    return Array.from({length: 20},(_, i ) => ({
      url:'/user.png'
  }))

  }

  onUploadImage(file:File){
    this.loading.set(true);
    this.memberservice.uploadPhoto(file).subscribe(
      {
        next: photo => {
          this.memberservice.editmode.set(false);
          this.loading.set(false);
          this.photos.update(photos => [...photos,photo])
          if(!this.memberservice.member()?.imageUrl)
            {
              this.setMainLoadPhoto(photo);

            }
        },
        error:error => {
          console.log('Error Uploading Image: ', error);
          this.loading.set(false); 
        }
      }
    )
  }

  setMainPhoto(photo: Photo){
    this.memberservice.setMainPhoto(photo).subscribe({
      next:() =>{
        this.setMainLoadPhoto(photo);

      }
    })

  }

  deletePhoto(photoId : number )
  {
    this.memberservice.deletePhoto(photoId).subscribe({
    next:() => {
      this.photos.update(photos => photos.filter(x => x.id != photoId))
    }
   })
  }

  private setMainLoadPhoto(photo:Photo){
    const currentUser = this.AccountService.CurrentUser();
        if(currentUser){
          currentUser.imageUrl = photo.url;
          this.AccountService.setCurrentUser(currentUser as User);
          this.memberservice.member.update(member => ({
          ...member,
          imageUrl:photo.url  
          }) as Member)

        }
  }

}
