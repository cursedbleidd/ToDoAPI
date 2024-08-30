using Microsoft.EntityFrameworkCore;

namespace ToDoAPI.Models
{
    public class CategoryContext : DbContext
        {
            public DbSet<Category> Categories { get; set; }

            public CategoryContext(DbContextOptions<CategoryContext> options)
                : base(options)
            {
                Database.EnsureCreated();
            }
        }
    }
