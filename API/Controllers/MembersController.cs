using API.DATA;
using API.Entities;
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

    }
}
