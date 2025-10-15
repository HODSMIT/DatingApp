using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.DATA;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }

    public DbSet<Member> Members { get; set; }

    public DbSet<Photo> Photos { get; set; }
    

    public DbSet<MemberLikes> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<MemberLikes>().HasKey(x => new { x.SourceMemberId, x.TargetMemberId });

        modelBuilder.Entity<MemberLikes>().HasOne(s => s.SourceMember)
        .WithMany(t => t.LikeMembers)
        .HasForeignKey(s => s.SourceMemberId)
        .OnDelete(DeleteBehavior.Cascade);


        modelBuilder.Entity<MemberLikes>().HasOne(s => s.TargetMember)
        .WithMany(t => t.LikeByMembers)
        .HasForeignKey(s => s.TargetMemberId)
        .OnDelete(DeleteBehavior.NoAction);

        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
            v => v.ToUniversalTime(),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc)

        );

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }

            }

        }

    }
}
