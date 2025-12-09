using System;
using API.Entities;
using API.Extensions;
using API.Helper;
using API.Interface;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController(IUnitofWork uow) : BaseController
{
    [HttpPost("{targerMemberId}")]
    public async Task<ActionResult> ToggleLike(string targerMemberId)
    {
        var sourceMemberId = User.GetMemberById();
        if (sourceMemberId == targerMemberId)
        {
            return BadRequest("You Cannot like yourself");
        }
        var existingLikes = await uow.LikesRepository.GetMemberLike(sourceMemberId, targerMemberId);

        if (existingLikes == null)
        {
            var like = new MemberLikes
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targerMemberId

            };

            uow.LikesRepository.AddLike(like);
        }
        else
        {
            uow.LikesRepository.DeleteLikes(existingLikes);
        }

        if (await uow.Complete())
        {
            return Ok();
        }
        return BadRequest("failed to Update like");



    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
    {
        return Ok(await uow.LikesRepository.GetCurrentMemberLikesId(User.GetMemberById()));
    }

    [HttpGet]
    public async Task<ActionResult<PaginationResult<Member>>> GetMemberLikes([FromQuery] LikesParam likesParam)
    {
        likesParam.MemberId = User.GetMemberById();
        var members = await uow.LikesRepository.GetMemberLikes(likesParam);
        return Ok(members);
    }


}
