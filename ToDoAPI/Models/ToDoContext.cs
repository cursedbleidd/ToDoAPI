using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace ToDoAPI.Models 
{
    public class ToDoContext : DbContext
    {
        public DbSet<ToDoItem> ToDoItems { get; set; }
        public DbSet<Category> Categories { get; set; }

        public ToDoContext(DbContextOptions<ToDoContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
