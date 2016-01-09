using com.vorwardit.wordsworthcms.Engine;
using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace com.vorwardit.wordsworthcms.API
{
    [Authorize]
    [RoutePrefix("api/layouts")]
    public class LayoutsController : ApiController
    {
        public ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid siteId)
        {
            return await Get(siteId, false);
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid siteId, bool noBody)
        {
            if (noBody)
            {
                return Ok(from l in db.Layouts
                          where l.SiteId == siteId
                          orderby l.Name
                          select new
                          {
                              l.LayoutId,
                              l.Name
                          });
            }
            else
            {
                return Ok(
                    await (from l in db.Layouts
                           where l.SiteId == siteId
                           orderby l.Name
                           select l).ToListAsync()
                    );
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
            layout.SiteId = model.SiteId;
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
