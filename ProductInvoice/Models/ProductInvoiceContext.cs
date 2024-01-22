using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace ProductInvoice.Models
{
    public partial class ProductInvoiceContext : DbContext
    {
        public ProductInvoiceContext()
        {
        }

        public ProductInvoiceContext(DbContextOptions<ProductInvoiceContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Invoice> Invoice { get; set; }
        public virtual DbSet<InvoiceList> InvoiceList { get; set; }
        public virtual DbSet<Product> Product { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=DESKTOP-1TALNNC\\MSSQLSERVER02; Database=ProductInvoice; Trusted_Connection=true;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasOne(d => d.InvoiceNavigation)
                    .WithMany(p => p.Invoice)
                    .HasForeignKey(d => d.InvoiceId)
                    .HasConstraintName("FK__Invoice__Invoice__2B3F6F97");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Invoice)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK__Invoice__Product__2C3393D0");
            });

            modelBuilder.Entity<InvoiceList>(entity =>
            {
                entity.Property(e => e.CustomerName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.InvoiceNo)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
