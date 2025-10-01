export type Member = {
  id: string
  dateofBirth: string
  imageUrl?: string
  email: any
  displayName: string
  created: string
  lastActive: string
  gender: string
  city: string
  country: string
  description?: string

}

export type Photo = {
  id: number
  url: string
  publicId: any
  member: any
  memberId: string
}

export type editablemember = {
  displayName : string;
  description? : string;
  city: string;
  country: string;  
}

export class MemberParams
{
  gender? : string;
  minAge = 18;
  maxAge = 100;
  pageNumber = 1;
  pageSize = 10;
  orderBy = 'lastActive';

}