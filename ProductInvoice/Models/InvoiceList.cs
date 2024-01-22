using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace ProductInvoice.Models
{
    public partial class InvoiceList
    {
        public InvoiceList()
        {
            Invoice = new HashSet<Invoice>();
        }

        public int Id { get; set; }
        public string InvoiceNo { get; set; }
        public string CustomerName { get; set; }
        public int? Total { get; set; }
        public DateTime? Date { get; set; }

        public virtual ICollection<Invoice> Invoice { get; set; }
    }
}
