using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.DATA;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }
}
