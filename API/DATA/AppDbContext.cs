using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.DATA;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<Member> Members { get; set; }

    public DbSet<Photo> Photos { get; set; }
    

    public DbSet<MemberLikes> Likes { get; set; }

    public DbSet<Message> Messages { get; set; }

    public DbSet<Group> Groups { get; set; }
    public DbSet<Connection> Connections { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IdentityRole>()
        .HasData(
            new IdentityRole { Id = "member-id", Name = "Member", NormalizedName = "MEMBER" },
            new IdentityRole { Id = "modetator-id", Name = "Moderator", NormalizedName = "MODERATOR" },
            new IdentityRole { Id = "admin-id", Name = "Admin", NormalizedName = "ADMIN" }
        );
        modelBuilder.Entity<Message>().HasOne(x => x.Recipient).WithMany(m => m.MessageReceived).OnDelete(DeleteBehavior.Restrict);


        modelBuilder.Entity<Message>().HasOne(x => x.Sender).WithMany(m => m.MessageSent).OnDelete(DeleteBehavior.Restrict);

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

        var nullableDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
           v => v.HasValue ? v.Value.ToUniversalTime() : null,
           v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : null

        );

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
                else if (property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(nullableDateTimeConverter);
                }

            }

        }

    }
}
