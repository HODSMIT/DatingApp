using System;

namespace API.DTOs;

public class MessageDto
{
    public required string Id { get; set; }

    public required string SenderId { get; set; }

    public string SenderDisplayName { get; set; }

    public string SenderImageUrl { get; set; }


    public required string ReceipienId { get; set; }

    public string RecipientDisplayName { get; set; }

    public string RecipientImageUrl { get; set; }

    public required string Content { get; set; }

    public DateTime? DateRead { get; set; }

    public DateTime? MessageSent { get; set; }

}
