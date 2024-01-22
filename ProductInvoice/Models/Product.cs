using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace ProductInvoice.Models
{
    public partial class Product
    {
        public Product()
        {
            Invoice = new HashSet<Invoice>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int? Price { get; set; }

        public virtual ICollection<Invoice> Invoice { get; set; }
    }
}
