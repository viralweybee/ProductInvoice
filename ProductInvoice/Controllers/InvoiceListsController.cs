using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductInvoice.Models;

namespace ProductInvoice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceListsController : ControllerBase
    {
        private readonly ProductInvoiceContext _context;

        public InvoiceListsController(ProductInvoiceContext context)
        {
            _context = context;
        }

        // GET: api/InvoiceLists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceList>>> GetInvoiceList()
        {
            return await _context.InvoiceList.ToListAsync();
        }

        // GET: api/InvoiceLists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceList>> GetInvoiceList(int id)
        {
            var invoiceList = await _context.InvoiceList.FindAsync(id);

            if (invoiceList == null)
            {
                return NotFound();
            }

            return invoiceList;
        }

        // PUT: api/InvoiceLists/5
        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoiceList(int id, InvoiceList invoiceList)
        {
            if (id != invoiceList.Id)
            {
                return BadRequest();
            }

            _context.Entry(invoiceList).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvoiceListExists(id))
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

        // POST: api/InvoiceLists

        [HttpPost]
        public async Task<ActionResult<InvoiceList>> PostInvoiceList(InvoiceList invoiceList)
        {
            _context.InvoiceList.Add(invoiceList);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInvoiceList", new { id = invoiceList.Id }, invoiceList);
        }

        // DELETE: api/InvoiceLists/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<InvoiceList>> DeleteInvoiceList(int id)
        {
            var invoiceList = await _context.InvoiceList.FindAsync(id);
            if (invoiceList == null)
            {
                return NotFound();
            }

            _context.InvoiceList.Remove(invoiceList);
            await _context.SaveChangesAsync();

            return invoiceList;
        }
        [HttpGet("SearchByProduct")]
        public async Task<ActionResult<List<InvoiceList>>> GetBySearch([FromQuery]string[] Products,[FromQuery]string startDate,[FromQuery]string endDate)
        {
            try
            {
                IQueryable<InvoiceList> query = _context.InvoiceList;

                // Apply filters based on the parameters
                if (Products != null && Products.Any())
                {
                    query = query.Where(il =>
                        il.Invoice.Any(i => i.Product != null && i.Product.Name != null && Products.Contains(i.Product.Name))
                    );
                }

                if (!string.IsNullOrEmpty(startDate))
                {   
                    DateTime startDateTime = DateTime.Parse(startDate);
                    query = query.Where(il => il.Date >= startDateTime);
                }

                if (!string.IsNullOrEmpty(endDate))
                {
                    DateTime endDateTime = DateTime.Parse(endDate);
                    query = query.Where(il => il.Date <= endDateTime);
                }

                
                List<InvoiceList> result = await query.ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        private bool InvoiceListExists(int id)
        {
            return _context.InvoiceList.Any(e => e.Id == id);
        }
    }
}
