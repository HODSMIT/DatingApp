using System.Security.Claims;
using API.DATA;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberReporsitory memberReporsitory, IPhotoService photoService) : BaseController
    {
        [HttpGet]

        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            //var member = await context.Users.ToListAsync();
            return Ok(await memberReporsitory.GetMembersAync());
        }

        [HttpGet("{Id}")]  // localhost:5001/api/smit -1

        public async Task<ActionResult<Member>> GetMembers(string Id)
        {
            var member = await memberReporsitory.GetMemberByIdAsync(Id);


            if (member == null)
            {
                return NotFound();

            }
            return member;

        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await memberReporsitory.GetPhotosForMemberAsync(id));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdatedto memberUpdatedto)
        {
            var memberId = User.GetMemberById();
            var member = await memberReporsitory.GetMemberForUpdate(memberId);

            if (member == null)
            {
                return BadRequest("Could not get Member");
            }
            member.DisplayName = memberUpdatedto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdatedto.Description ?? member.Description;
            member.City = memberUpdatedto.City ?? member.City;
            member.Country = memberUpdatedto.Country ?? member.Country;

            member.User.DisplayName = memberUpdatedto.DisplayName ?? member.User.DisplayName;

            //memberReporsitory.Update(member);//optional 

            if (await memberReporsitory.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Failed to update to member");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhotot([FromForm] IFormFile File)
        {
            var member = await memberReporsitory.GetMemberForUpdate(User.GetMemberById());

            if (member == null)
            {
                return BadRequest("Cannot Updaye member ");
            }

            var result = await photoService.UploadPhotoAsync(File);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var Photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberById()
            };

            if (member.ImageUrl == null)
            {

                member.ImageUrl = Photo.Url;
                member.User.ImageUrl = Photo.Url;

            }

            member.Photos.Add(Photo);

            if (await memberReporsitory.SaveAllAsync())
            {
                return Photo;
            }

            return BadRequest("Problem Adding Photo");

        }

        [HttpPut("set-main-photo/{photoid}")]

        public async Task<ActionResult> SetMainPhoto(int photoid)
        {

            var member = await memberReporsitory.GetMemberForUpdate(User.GetMemberById());
            if (member == null)
            {
                return BadRequest("Cannot Get member from token");
            }

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoid);

            if (member.ImageUrl == photo.Url)
            {
                return BadRequest("Cannot Set This as main image");
            }

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            if (await memberReporsitory.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Problem Setting Main Photo");
        }


        [HttpDelete("delete-photo/{photoid}")]

        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await memberReporsitory.GetMemberForUpdate(User.GetMemberById());
            if (member == null)
            {
                return BadRequest("Cannot Get member from token");
            }

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (photo == null || photo.Url == member.ImageUrl)
            {
                return BadRequest("this photo cannot be deleted");

            }

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);

                }

                member.Photos.Remove(photo);

                if (await memberReporsitory.SaveAllAsync())
                {
                    return Ok();

                }


            }
            return BadRequest("Problem deleting Photo");

        }    

    }
}
