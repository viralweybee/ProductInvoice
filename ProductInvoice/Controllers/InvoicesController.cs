using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ProductInvoice.DisplayModel;
using ProductInvoice.Models;

namespace ProductInvoice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly ProductInvoiceContext _context;

        public InvoicesController(ProductInvoiceContext context)
        {
            _context = context;
        }

        // GET: api/Invoices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoice()
        {
            return await _context.Invoice.ToListAsync();
        }

        // GET: api/Invoices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> GetInvoice(int id)
        {
            var invoice = await _context.Invoice.FindAsync(id);

            if (invoice == null)
            {
                return NotFound();
            }

            return invoice;
        }

        // PUT: api/Invoices/5
      
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoice(int id, Invoice invoice)
        {
            if (id != invoice.Id)
            {
                return BadRequest();
            }

            _context.Entry(invoice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvoiceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Invoices

        [HttpPost]
        public async Task<ActionResult<Invoice>> PostInvoice(Invoice invoice)
        {
            _context.Invoice.Add(invoice);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInvoice", new { id = invoice.Id }, invoice);
        }

        // DELETE: api/Invoices/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Invoice>> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoice.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            _context.Invoice.Remove(invoice);
            await _context.SaveChangesAsync();

            return invoice;
        }
        [HttpGet("InvoiceNo")]
        public async Task<string> InvoiceNoGenerator([FromQuery]string date)
        {
            string[] dateParts = date.Split('-');
            int year = Convert.ToInt32(dateParts[0]);
            int month = Convert.ToInt32(dateParts[1]);
            string upperBound = "";
            string lowerBound = "";
            string value1 = "";
            if (month >= 04)
            {
                upperBound = ((year + 1).ToString() + "-04-01");
                lowerBound = ((year).ToString() + "-04-01");
            }
            else
            {
                --year;
                upperBound = ((year+1).ToString() + "-04-01");
                lowerBound = ((year).ToString() + "-04-01");
            }
            string year1 = year.ToString();
            string year2 = (year + 1).ToString();
            value1 = "INV"+year1+(year2).Substring(2);
            string connectionString = @"Data Source=DESKTOP-1TALNNC\MSSQLSERVER02;Initial Catalog=ProductInvoice;Integrated Security=True;";
            string ans = "";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string query = "select max(invoiceNo) from InvoiceList where Date <@date1 and Date >=@date2";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@date1", upperBound);
                    command.Parameters.AddWithValue("@date2", lowerBound);         
                    Object result = await command.ExecuteScalarAsync();                 
                    int maxInvoiceNo;
                    if (result == DBNull.Value)
                    {
                        maxInvoiceNo = 0;
                    }
                    else
                    {
                        string s1 = result.ToString();
                        maxInvoiceNo = Convert.ToInt32(s1.Substring(s1.Length - 3));
                    }
                    if (maxInvoiceNo <= 9)
                    {
                        ans = value1 + "00" + (maxInvoiceNo + 1).ToString();
                    }
                    else if (maxInvoiceNo <= 99)
                    {
                        ans = value1 +"0"+(maxInvoiceNo + 1).ToString();
                    }
                    else
                    {
                        ans = value1 + (maxInvoiceNo + 1).ToString();
                    }
                }
            }
            return ans;
        }
        [HttpGet("GetInvoiceDetails")]
        public async Task<ActionResult<List<DisplayInvoice>>> GetInvoiceById(int id)
        {
            List<DisplayInvoice> displayInvoice = new List<DisplayInvoice>();
            string connectionString = @"Data Source=DESKTOP-1TALNNC\MSSQLSERVER02;Initial Catalog=ProductInvoice;Integrated Security=True;";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                
                using (SqlCommand command = new SqlCommand("GetInvoiceData1", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@id", id);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            // Access the data returned by the stored procedure
                            displayInvoice.Add(new DisplayInvoice
                            {
                                Id = Convert.ToInt32(reader["Id"].ToString()),
                                ProductName = reader["Name"].ToString(),
                                price = Convert.ToInt32(reader["Price"].ToString()),
                                quantity = Convert.ToInt32(reader["Quantity"].ToString())
                            }) ;

                        }
                    }
                }
            }
            return Ok(displayInvoice);
        }
        [HttpDelete("Invoice")]
        public async Task<ActionResult<Invoice>> DeleteInvoice1(int id)
        {
            try
            {
               
                var invoicesToDelete = await _context.Invoice.Where(i => i.InvoiceId == id).ToListAsync();

                if (invoicesToDelete == null || invoicesToDelete.Count == 0)
                {
                    return NotFound(); 
                }

               
                _context.Invoice.RemoveRange(invoicesToDelete);
                await _context.SaveChangesAsync();

                return Ok(invoicesToDelete); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool InvoiceExists(int id)
        {
            return _context.Invoice.Any(e => e.Id == id);
        }
    }
}
