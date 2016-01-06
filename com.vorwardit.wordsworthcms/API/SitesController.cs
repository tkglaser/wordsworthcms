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
    [RoutePrefix("api/sites")]
    public class SitesController : ApiController
    {
        public ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {
            return Ok(await db.Sites.ToListAsync());
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(Site model)
        {
            Site site;
            if (model.SiteId == Guid.Empty)
            {
                site = new Site();
                site.SiteId = Guid.NewGuid();
                db.Sites.Add(site);
            }
            else
            {
                site = await db.Sites.FindAsync(model.SiteId);
            }
            site.Name = model.Name;
            site.Bindings = model.Bindings;
            await db.SaveChangesAsync();
            DbPathProviderSingleton.Instance.InvalidateCache();
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(Guid id)
        {
            var site = await db.Sites.FindAsync(id);
            if (site != null)
            {
                db.Sites.Remove(site);
                await db.SaveChangesAsync();
            }
            return Ok();
        }
    }
}
