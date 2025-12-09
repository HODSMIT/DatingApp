using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helper;
using API.Interface;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessageController(IUnitofWork uow) : BaseController
{
    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
    {
        var sender = await uow.MemberReporsitory.GetMemberByIdAsync(User.GetMemberById());
        var recipient = await uow.MemberReporsitory.GetMemberByIdAsync(createMessageDto.RecipientId);

        if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
            return BadRequest("Cannot send this message");

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDto.Content
        };

        uow.MessageRepository.AddMessage(message);

        if (await uow.Complete()) return message.ToDto();

        return BadRequest("Failed to send message");
    }

    [HttpGet]
    public async Task<ActionResult<PaginationResult<MessageDto>>> GetMessagesByContainer(
        [FromQuery] MessageParam messageParams)
    {
        messageParams.MemberId = User.GetMemberById();

        return await uow.MessageRepository.GetMessagesForMember(messageParams);
    }

    [HttpGet("thread/{recipientId}")]
    public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
    {
        return Ok(await uow.MessageRepository.GetMessageThread(User.GetMemberById(), recipientId));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(string id)
    {
        var memberId = User.GetMemberById();

        var message = await uow.MessageRepository.GetMessage(id);

        if (message == null) return BadRequest("Cannot delete this message");

        if (message.SenderId != memberId && message.RecipientId != memberId)
            return BadRequest("You cannot delete this message");

        if (message.SenderId == memberId) message.SenderDeleted = true;
        if (message.RecipientId == memberId) message.RecipientDeleted = true;

        if (message is { SenderDeleted: true, RecipientDeleted: true })
        {
            uow.MessageRepository.DeleteMessage(message);
        }

        if (await uow.Complete()) return Ok();

        return BadRequest("Problem deleting the message");
    }
}
