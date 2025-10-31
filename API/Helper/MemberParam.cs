using System;

namespace API.Helper;

public class MemberParam : PagingParams
{

    public string? MemberId { get; set; }
    public string Container { get; set; } = "Inbox";

}
