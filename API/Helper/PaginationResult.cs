using System;
using Microsoft.EntityFrameworkCore;

namespace API.Helper;

public class PaginationResult<T>
{
    public PaginationMetadata Metadata { get; set; } = default!;

    public List<T> Items { get; set; } = [];

};

public class PaginationMetadata
{
    public int CurrentPage { get; set; }
    public int totalPages { get; set; }

    public int PageSize { get; set; }

    public int TotalCount { get; set; }

};


public class PaginationHelper
{


    public static async Task<PaginationResult<T>> CreateAsync<T>(IQueryable<T> query,
    int pageNumber, int PageSize)
    {
        var count = await query.CountAsync();
        var items = await query.Skip((pageNumber - 1) * PageSize).Take(PageSize).ToListAsync();

        return new PaginationResult<T>
        {
            Metadata = new PaginationMetadata
            {
                CurrentPage = pageNumber,
                totalPages = (int)Math.Ceiling(count / (double)PageSize),
                PageSize = PageSize,
                TotalCount = count

            },
            Items = items

        };
    }
}