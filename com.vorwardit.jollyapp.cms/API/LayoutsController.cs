using com.vorwardit.jollyapp.cms.Engine;
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
            return await Get(false);
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(bool noBody)
        {
            if (noBody)
            {
                return Ok(from l in db.Layouts
                          orderby l.Name
                          select new
                          {
                              l.LayoutId,
                              l.Name
                          });
            }
            else
            {
                return Ok(await db.Layouts.OrderBy(l => l.Name).ToListAsync());
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(Layout model)
        {
            Layout layout;
            if (model.LayoutId == Guid.Empty)
            {
                layout = new Layout();
                layout.LayoutId = Guid.NewGuid();
                db.Layouts.Add(layout);
            }
            else
            {
                layout = await db.Layouts.FindAsync(model.LayoutId);
            }
            layout.Name = model.Name;
            layout.Body = model.Body;
            await db.SaveChangesAsync();
            DbPathProviderSingleton.Instance.InvalidateCache();
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(Guid id)
        {
            var layout = await db.Layouts.FindAsync(id);
            if (layout != null)
            {
                db.Layouts.Remove(layout);
                await db.SaveChangesAsync();
            }
            return Ok();
        }
    }
}
