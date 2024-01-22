using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductInvoice.DisplayModel
{
    public class DisplayInvoice
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public int quantity { get; set; }
        public int price { get; set; }
    }
}
