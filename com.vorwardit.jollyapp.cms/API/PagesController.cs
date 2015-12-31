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
    [RoutePrefix("/api/pages")]
    public class PagesController : ApiController
    {
        public ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {
            var pages = await db.Pages.OrderBy(p => p.Name).Include("Site").Include("PageLayout").AsNoTracking().ToListAsync();

            // remove recursive backlinks so it can serialise
            foreach(var page in pages)
            {
                foreach(var url in page.Urls)
                {
                    url.Page = null;
                }
                foreach (var version in page.Versions)
                {
                    version.Page = null;
                    version.Body = null;
                }
                page.PageLayout.Body = null;
            }
            return Ok(pages);
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(Page model)
        {
            Page page;
            if (model.PageId == Guid.Empty)
            {
                page = new Page();
                page.PageId = Guid.NewGuid();
                page.Urls = new HashSet<PageUrl>();
                db.Pages.Add(page);
            }
            else
            {
                page = await db.Pages.FindAsync(model.PageId);
            }
            foreach(var url in page.Urls.ToArray())
            {
                db.PageUrls.Remove(url);
            }
            foreach(var url in model.Urls)
            {
                page.Urls.Add(new PageUrl
                {
                    Url = url.Url
                });
            }
            page.Name = model.Name;
            page.SiteId = model.SiteId;
            page.PageLayoutId = model.PageLayoutId;
            await db.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(Guid id)
        {
            var page = await db.Pages.FindAsync(id);
            if (page != null)
            {
                foreach (var url in page.Urls.ToArray())
                {
                    db.PageUrls.Remove(url);
                }
                db.Pages.Remove(page);
                await db.SaveChangesAsync();
            }
            return Ok();
        }
    }
}
