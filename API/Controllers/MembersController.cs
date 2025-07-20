using API.DATA;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class MembersController(AppDbContext context) : BaseController
    {
        [HttpGet]

        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            var member = await context.Users.ToListAsync();
            return member;
        }

        [Authorize]
        [HttpGet("{Id}")]  // localhost:5001/api/smit -1

        public async Task<ActionResult<AppUser>> GetMembers(string Id)
        {
            var member = await context.Users.FindAsync(Id);


            if (member == null)
            {
                return NotFound();

            }
            return member;

        }

    }
}
