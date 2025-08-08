
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Member
{
    public string Id { get; set; } = null!;

    public DateOnly DateofBirth { get; set; }

    public string? ImageUrl { get; set; }

    public string? Email { get; set;     }

    public required string DisplayName { get; set; }

    public DateTime Created { get; set; } = DateTime.UtcNow;

    public DateTime LastActive { get; set; } = DateTime.UtcNow;

    public required string Gender { get; set; }

    public required string City { get; set; }

    public required string Country { get; set; }

    public string? Description { get; set; }

    [JsonIgnore]
    public List<Photo> Photos { get; set; } = [];
    

    [JsonIgnore]
    [ForeignKey(nameof(Id))]
    public AppUser User { get; set; } = null!;
   
}
