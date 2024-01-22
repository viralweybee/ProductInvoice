using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace ProductInvoice.Models
{
    public partial class Invoice
    {
        public int Id { get; set; }
        public int? InvoiceId { get; set; }
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }

        public virtual InvoiceList InvoiceNavigation { get; set; }
        public virtual Product Product { get; set; }
    }
}
