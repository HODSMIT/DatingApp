using System;

namespace API.Helper;

public class LikesParam : PagingParams
{
    public string MemberId { get; set; } = "";
    public string Predicate { get; set; } = "liked";

}
