using System;
using API.Entities;
using API.Extensions;
using API.Interface;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController(ILikesRepository likesRepository) : BaseController
{
    [HttpPost("{targerMemberId}")]
    public async Task<ActionResult> ToggleLike(string targerMemberId)
    {
        var sourceMemberId = User.GetMemberById();
        if (sourceMemberId == targerMemberId)
        {
            return BadRequest("You Cannot like yourself");
        }
        var existingLikes = await likesRepository.GetMemberLike(sourceMemberId, targerMemberId);

        if (existingLikes == null)
        {
            var like = new MemberLikes
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targerMemberId

            };

            likesRepository.AddLike(like);
        }
        else
        {
            likesRepository.DeleteLikes(existingLikes);
        }

        if (await likesRepository.SaveAllChanges())
        {
            return Ok();
        }
        return BadRequest("failed to Update like");



    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
    {
        return Ok(await likesRepository.GetCurrentMemberLikesId(User.GetMemberById()));
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMemberLikes(string predicate)
    {
        var members = await likesRepository.GetMemberLike(predicate, User.GetMemberById());
        return Ok(members);
    }


}
