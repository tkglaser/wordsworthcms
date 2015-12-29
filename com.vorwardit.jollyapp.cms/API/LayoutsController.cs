using com.vorwardit.jollyapp.cms.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace com.vorwardit.jollyapp.cms.API
{
    [RoutePrefix("/api/layouts")]
    public class LayoutsController : ApiController
    {
        public ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {
            return Ok(await db.Layouts.ToListAsync());
        }
    }
}
