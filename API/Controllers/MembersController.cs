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
    public class MembersController(IMemberReporsitory memberReporsitory) : BaseController
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

    }
}
