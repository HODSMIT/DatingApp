using System;

namespace API.Helper;

public class MemberParams : PagingParams
{
    public string? Gender { get; set; }

    public string? CurrentmemberId { get; set; }


    public int MinAge { get; set; } = 18;

    public int Maxage { get; set; } = 100;

    public string OrderBy { get; set; } = "LastActive";




}
